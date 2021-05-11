# ViewSets here
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import Student
from accounts.serializers import StudentSerializer
from .models import Task, Course, Grade, Achievement
from rest_framework import viewsets, permissions
from .serializers import TaskSerializer, CourseDetailSerializer, CreateGradeSerializer, \
    CreateCourseSerializer, CourseListSerializer, TaskListSerializer, GradeDetailSerializer, \
    GradeListSerializer, TaskMainSerializer, GradeMinimalSerializer, \
    CreateAchievementSerializer, ListAchievementSerializer


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.DjangoModelPermissions
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return TaskListSerializer
        if self.action == 'retrieve':
            return TaskSerializer
        if self.action == 'create':
            return TaskSerializer
        return TaskSerializer

    def get_queryset(self):
        """ restrict queryset so that users can see only their own tasks. """
        if hasattr(self.request.user, 'teacher'):
            courses = self.request.user.teacher.course_set.all()
            tasks = Task.objects.filter(course__in=courses)
            return tasks
        elif hasattr(self.request.user, 'student'):
            courses = self.request.user.student.course_set.all()
            tasks = Task.objects.filter(course__in=courses)
            return tasks
        return None

    def partial_update(self, request, pk=None, **kwargs):
        task = Task.objects.get(pk=pk)
        serializer = self.get_serializer(task, data=request.data, partial=True)
        serializer.is_valid()
        task = serializer.save()
        return Response({"task": TaskSerializer(task).data})

    @action(detail=True)  # todo permissions
    def children(self, request, pk=None):
        task = Task.objects.filter(parent_task=pk)
        return Response({"children": TaskSerializer(task, many=True).data})

    @action(detail=True)  # todo permissions
    def grades(self, request, pk=None):
        grades = Grade.objects.filter(task=pk)
        return Response({"grades": GradeMinimalSerializer(grades, many=True).data})

    @action(detail=True, methods=['POST'])
    def add_grade(self, request, pk=None):
        """ provide {"students" : [1,2,3..], "grades": [4,4,5..]}
            (list of students ids to be added to course)"""
        student_ids = request.data['students']
        grade_values = request.data['grades']
        task = Task.objects.get(pk=pk)
        for student_id in student_ids:
            student = Student.objects.get(pk=student_id)
            grade = Grade.objects.create(task=task, value=grade_values[student_ids.index(student_id)],
                                         student=student, course=task.course,
                                         issued_by=task.course.teacher)
            grade.save()
        return Response({"status": 'ok'})


class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.DjangoModelPermissions
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        if self.action == 'retrieve':
            return CourseDetailSerializer
        if self.action == 'create':
            return CreateCourseSerializer
        if self.action == 'update':
            return CreateCourseSerializer
        return CreateCourseSerializer

    def get_queryset(self):
        if hasattr(self.request.user, 'teacher'):
            teacher = self.request.user.teacher
            return teacher.course_set.all()
        elif hasattr(self.request.user, 'student'):
            student = self.request.user.student
            return student.course_set.all()
        return None

    def partial_update(self, request, pk=None, **kwargs):
        course = Course.objects.get(pk=pk)
        serializer = self.get_serializer(course, data=request.data, partial=True)
        serializer.is_valid()
        course = serializer.save()
        return Response({"course": CreateCourseSerializer(course).data})

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user.teacher)

    @action(detail=True)  # todo add parmission_classes = IsTeacher (create permission class)
    def students(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        students_ = course.student.all()
        return Response({"students": StudentSerializer(students_, many=True).data})

    @action(detail=True)
    def achievements(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        if hasattr(self.request.user, 'teacher'):
            achievements_ = course.achievement_set.all()
            return Response({"achievements": ListAchievementSerializer(achievements_, many=True).data})
        elif hasattr(self.request.user, 'student'):
            student = self.request.user.student
            achievements_ = course.achievement_set.all()
            earned = achievements_.filter(pk__in = student.achievement_set.all())
            not_earned = achievements_.exclude(pk__in = student.achievement_set.all())
            return Response({"achievements":
                {
                    "earned": ListAchievementSerializer(earned, many=True).data,
                    "not_earned": ListAchievementSerializer(not_earned, many=True).data
                 }
             })

    @action(detail=True, methods=['POST'])
    def add_students(self, request, pk=None):
        """ provide {"students" : [1,2,3..]}
            (list of students ids to be added to course)"""
        student_ids = request.data['students']
        course = Course.objects.get(pk=pk)
        for student_id in student_ids:
            course.student.add(student_id)
        return Response({"status": 'ok'})

    @action(detail=True, methods=['POST'])
    def del_students(self, request, pk=None):
        """ provide {"students" : [1,2,3..]}
            (list of students ids to be added to course)"""
        student_ids = request.data['students']
        course = Course.objects.get(pk=pk)
        for student_id in student_ids:
            course.student.remove(student_id)
        return Response({"status": 'ok'})

    @action(detail=True)
    def tasks(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        tasks_ = course.task_set.all()
        return Response({"tasks": TaskListSerializer(tasks_, many=True, context=self.get_serializer_context()).data})

    @action(detail=True)
    def main_tasks(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        tasks_ = course.task_set.filter(parent_task=None)
        return Response({"tasks": TaskMainSerializer(tasks_, many=True, context=self.get_serializer_context()).data})


class GradeViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.DjangoModelPermissions
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return GradeListSerializer
        if self.action == 'retrieve':
            return GradeDetailSerializer
        if self.action == 'create':
            return CreateGradeSerializer
        if self.action == 'update':
            return CreateGradeSerializer
        return CreateGradeSerializer

    def get_queryset(self):
        if hasattr(self.request.user, 'teacher'):  # todo use .is_student ?
            teacher = self.request.user.teacher
            return teacher.grade_set.all()
        elif hasattr(self.request.user, 'student'):
            student = self.request.user.student
            return student.grade_set.all()
        return None

    def partial_update(self, request, pk=None, **kwargs):
        grade = Grade.objects.get(pk=pk)
        serializer = self.get_serializer(grade, data=request.data, partial=True)
        serializer.is_valid()
        grade = serializer.save()
        return Response({"grade": CreateGradeSerializer(grade).data})

    def perform_create(self, serializer):
        serializer.save(issued_by=self.request.user.teacher)


class AchievementViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return ListAchievementSerializer
        if self.action == 'retrieve':
            return CreateAchievementSerializer
        if self.action == 'create':
            return CreateAchievementSerializer
        if self.action == 'update':
            return CreateAchievementSerializer
        return CreateAchievementSerializer

    def get_queryset(self):
        if hasattr(self.request.user, 'teacher'):  # todo use .is_student ?
            courses = self.request.user.teacher.course_set.all()
            ach = Achievement.objects.filter(course__in=courses)
            return ach
        elif hasattr(self.request.user, 'student'):
            student = self.request.user.student
            return student.achievement_set.all()
        return None

