from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('student_login', views.index),
    path('teacher_login', views.index),
]