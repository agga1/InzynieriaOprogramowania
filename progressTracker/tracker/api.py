# ViewSets here
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import Student
from accounts.serializers import StudentSerializer
from .models import Mock, Task, Course, Grade, Prize
from rest_framework import viewsets, permissions, generics
from .serializers import MockSerializer, TaskSerializer, CourseDetailSerializer, CreateGradeSerializer, PrizeSerializer, \
    CreateCourseSerializer, CourseListSerializer


class MockViewSet(viewsets.ModelViewSet):
    queryset = Mock.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MockSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TaskSerializer


class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.AllowAny  # todo change permission
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        if self.action == 'retrieve':
            return CourseDetailSerializer
        if self.action == 'create':
            return CreateCourseSerializer
        return None

    def get_queryset(self):
        if hasattr(self.request.user, 'teacher'): # todo use .is_student ?
            teacher = self.request.user.teacher
            return teacher.course_set.all()
        elif hasattr(self.request.user, 'student'):
            student = self.request.user.student
            return student.course_set.all()
        return None

    @action(detail=True)
    def students(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        students_ = course.student.all()
        print(students_)
        return Response({"students": StudentSerializer(students_, many=True).data})

    @action(detail=True)
    def tasks(self, request, pk=None):
        course = Course.objects.get(pk=pk)
        tasks_ = course.task_set.all()
        return Response({"tasks": TaskSerializer(tasks_, many=True).data})

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = CreateGradeSerializer


class PrizeViewSet(viewsets.ModelViewSet):
    queryset = Prize.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = PrizeSerializer

