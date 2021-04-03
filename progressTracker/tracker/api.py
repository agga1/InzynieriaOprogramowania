# ViewSets here
from .models import Mock, Task, Course
from rest_framework import viewsets, permissions
from .serializers import MockSerializer, TaskSerializer, CourseSerializer


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

