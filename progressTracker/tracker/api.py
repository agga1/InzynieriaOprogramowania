# ViewSets here
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import Student
from accounts.serializers import StudentSerializer
from .models import Mock, Task, Course, Grade, Prize
from rest_framework import viewsets, permissions
from .serializers import MockSerializer, TaskSerializer, CourseDetailSerializer, CreateGradeSerializer, \
    PrizeListSerializer, CreateCourseSerializer, CourseListSerializer, TaskListSerializer, GradeDetailSerializer, \
    GradeListSerializer, PrizeDetailSerializer, CreatePrizeSerializer


class MockViewSet(viewsets.ModelViewSet):
    queryset = Mock.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MockSerializer


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
        print(students_)
        return Response({"students": StudentSerializer(students_, many=True).data})

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
        serializer.save(teacher=self.request.user.teacher)


class PrizeViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.DjangoModelPermissions
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return PrizeListSerializer
        if self.action == 'retrieve':
            return PrizeDetailSerializer
        if self.action == 'create':
            return CreatePrizeSerializer
        if self.action == 'update':
            return CreatePrizeSerializer
        return CreatePrizeSerializer

    def get_queryset(self):
        if hasattr(self.request.user, 'teacher'):  # todo use .is_student ?
            courses = self.request.user.teacher.course_set.all()
            prizes = Prize.objects.filter(course__in=courses)
            return prizes
        elif hasattr(self.request.user, 'student'):
            student = self.request.user.student
            return student.proize_set.all()
        return None

    def partial_update(self, request, pk=None, **kwargs):
        prize = Prize.objects.get(pk=pk)
        serializer = self.get_serializer(prize, data=request.data, partial=True)
        serializer.is_valid()
        prize = serializer.save()
        return Response({"prize": CreateGradeSerializer(prize).data})

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user.teacher)
