from django.urls import path
from rest_framework import routers
from . import views
from .api import TaskViewSet, CourseViewSet, GradeViewSet, AchievementViewSet, CourseGroupViewSet

router = routers.DefaultRouter()
router.register('api/tasks', TaskViewSet, 'task')
router.register('api/courses', CourseViewSet, 'course')
router.register('api/grades', GradeViewSet, 'grade')
router.register('api/groups', CourseGroupViewSet, 'group')
router.register('api/achievements', AchievementViewSet, 'achievement')
urlpatterns = [
]
urlpatterns += router.urls
