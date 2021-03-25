# ViewSets here
from .models import Mock
from rest_framework import viewsets, permissions
from .serializers import MockSerializer

class MockViewSet(viewsets.ModelViewSet):
    queryset = Mock.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = MockSerializer
