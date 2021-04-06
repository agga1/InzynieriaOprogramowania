# ViewSets here
from .models import Mock, Task, Course, Grade, Prize
from rest_framework import viewsets, permissions
from .serializers import MockSerializer, TaskSerializer, CourseSerializer, GradeSerializer, PrizeSerializer


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
    queryset = Course.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = CourseSerializer


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = GradeSerializer


class PrizeViewSet(viewsets.ModelViewSet):
    queryset = Prize.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = PrizeSerializer

