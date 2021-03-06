# ViewSets here
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import Student
from accounts.serializers import StudentSerializer
from .models import Task, Course, Grade, Achievement, CourseGroup
from rest_framework import viewsets, permissions
from .serializers import TaskSerializer, CourseDetailSerializer, CreateGradeSerializer, \
    CreateCourseSerializer, CourseListSerializer, TaskListSerializer, GradeDetailSerializer, \
    GradeListSerializer, TaskMainSerializer, GradeMinimalSerializer, \
    CreateAchievementSerializer, ListAchievementSerializer, CourseGroupSerializer, CreateCourseGroupSerializer, \
    UpdateCourseGroupSerializer, CourseGroupListSerializer, recalculate_parent
import csv


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
            recalculate_parent(grade)
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
    def groups(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        groups_ = course.coursegroup_set.all()
        return Response({"groups": CourseGroupListSerializer(groups_, many=True)
                        .data})

    @action(detail=True)
    def achievements(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        if hasattr(self.request.user, 'teacher'):
            achievements_ = course.achievement_set.all()
            return Response({"achievements": ListAchievementSerializer(achievements_, many=True).data})
        elif hasattr(self.request.user, 'student'):
            student = self.request.user.student
            achievements_ = course.achievement_set.all()
            earned = achievements_.filter(pk__in=student.achievement_set.all())
            not_earned = achievements_.exclude(pk__in=student.achievement_set.all())
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
    def main_tasks(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        tasks_ = course.task_set.filter(parent_task=None)
        return Response({"tasks": TaskMainSerializer(tasks_, many=True, context=self.get_serializer_context()).data})

    @action(detail=True)
    def tasks(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        tasks_ = course.task_set.all()
        return Response({"tasks": TaskListSerializer(tasks_, many=True, context=self.get_serializer_context()).data})

    @action(detail=True)
    def grades_csv(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        students_names = [str(s) for s in course.student.all()]  # get all students, even those without grades
        tasks_names = [task.name for task in course.task_set.all()]  # get all tasks, even those without grades

        grades_dict = self.get_grades_dict(course, students_names)
        response = self.grades_dict_to_http(grades_dict, tasks_names)
        return response

    def get_grades_dict(self, course, students_names):
        """ create a dict with entry for each given student.
            Each entry contains dict of key-value pairs "task_name": "received grade".
            For given student, there are no entries for tasks in which student did not receive a grade! """
        grades = course.grade_set.all()
        grades_dict = {}
        for student_name in students_names:
            grades_dict[student_name] = {}
        for grade in grades:
            grade = GradeListSerializer(grade, context=self.get_serializer_context()).data
            student, task_name, value = grade['student_name'], grade['task_name'], grade['value']
            grades_dict[student][task_name] = value
        return grades_dict

    def grades_dict_to_http(self, grades_dict, tasks_names):
        from django.http import HttpResponse
        response = HttpResponse(
            content_type='text/csv',
        )
        writer = csv.writer(response)
        writer.writerow(['student'] + tasks_names)
        for student, tasks_dict in grades_dict.items():
            writer.writerow([student] + [tasks_dict.get(task, "-") for task in tasks_names])
        return response


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


class CourseGroupViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseGroupSerializer
        if self.action == 'retrieve':
            return CourseGroupSerializer
        if self.action == 'create':
            return CreateCourseGroupSerializer
        if self.action == 'update':
            return UpdateCourseGroupSerializer
        return CourseGroupSerializer

    def get_queryset(self):
        """ restrict queryset so that users can see only their own tasks. """
        if hasattr(self.request.user, 'teacher'):
            courses = self.request.user.teacher.course_set.all()
            groups = CourseGroup.objects.filter(course__in=courses)
            return groups

        elif hasattr(self.request.user, 'student'):
            courses = self.request.user.student.course_set.all()
            groups = CourseGroup.objects.filter(course__in=courses)
            return groups
        return None

    @action(detail=True, methods=['POST'])
    def add_grade(self, request, pk=None):
        """ provide {"grade": 4, "task": 31} """
        grade_value = request.data['grade']
        task = Task.objects.get(pk=request.data['task'])
        group = CourseGroup.objects.get(pk=pk)
        students = group.student.all()
        for student_id in students:
            grade = Grade.objects.create(task=task, value=grade_value,
                                         student=student_id, course=task.course,
                                         issued_by=task.course.teacher)
            grade.save()
            recalculate_parent(grade)
        return Response({"status": 'ok'})

    @action(detail=True, methods=['POST'])
    def add_students(self, request, pk=None):
        """ provide {"students" : [1,2,3..]}
            (list of students ids to be added to group)"""
        student_ids = request.data['students']
        group = CourseGroup.objects.get(pk=pk)
        for student_id in student_ids:
            group.student.add(student_id)
        return Response({"status": 'ok'})

    @action(detail=True, methods=['POST'])
    def del_students(self, request, pk=None):
        """ provide {"students" : [1,2,3..]}
            (list of students ids to be deleted from course)"""
        student_ids = request.data['students']
        group = CourseGroup.objects.get(pk=pk)
        for student_id in student_ids:
            group.student.remove(student_id)
        return Response({"status": 'ok'})
