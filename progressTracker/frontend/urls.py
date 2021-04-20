from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('student_login', views.index),
    path('teacher_login', views.index),
    path('student/courses', views.index),
    # path('teacher/courses', views.index),
    path('student/course/tasks', views.index),
    path('student/course/students', views.index),
    path('teacher/course/add', views.index),
]
