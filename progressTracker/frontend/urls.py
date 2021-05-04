from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('student/login', views.index),
    path('teacher/login', views.index),
    path('student/courses', views.index),
    path('teacher/courses', views.index),
    path('student/course/tasks', views.index),
    path('teacher/course/tasks', views.index),
    path('student/course/students', views.index),
    path('teacher/course/students', views.index),
    path('teacher/course/add', views.index),
    path('teacher/task/add', views.index),
    path('teacher/task/grades', views.index),
    path('teacher/task/details', views.index),
    path('student/task/details', views.index),
    path('teacher/task/update', views.index),
    path('teacher/course/leaderboard', views.index),
]
