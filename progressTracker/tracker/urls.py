from django.urls import path
from rest_framework import routers
from . import views
from .api import MockViewSet, TaskViewSet, CourseViewSet, GradeViewSet, PrizeViewSet, AchievementViewSet

router = routers.DefaultRouter()
router.register('api/mocks', MockViewSet, 'mock')
router.register('api/tasks', TaskViewSet, 'task')
router.register('api/courses', CourseViewSet, 'course')
router.register('api/grades', GradeViewSet, 'grade')
router.register('api/prizes', PrizeViewSet, 'prize')
router.register('api/achievements', AchievementViewSet, 'achievement')
urlpatterns = [
]
urlpatterns += router.urls
