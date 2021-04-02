from django.urls import path
from rest_framework import routers
from . import views
from .api import MockViewSet, TaskViewSet

router = routers.DefaultRouter()
router.register('api/mocks', MockViewSet, 'mock')
router.register('api/tasks', TaskViewSet, 'task')
urlpatterns = []
urlpatterns += router.urls
