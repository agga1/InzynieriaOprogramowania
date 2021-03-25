from django.urls import path
from rest_framework import routers
from . import views
from .api import MockViewSet

router = routers.DefaultRouter()
router.register('api/mocks', MockViewSet, 'mock')
urlpatterns = router.urls
# urlpatterns = [
#     path('', views.index, name='index'),
# ]