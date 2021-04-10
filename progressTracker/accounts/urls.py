from django.urls import path, include
from .api import RegisterApi, LoginAPI, UserAPI, RegisterStudentApi, RegisterTeacherApi, logout_api

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/logout', logout_api),  # default logout, invalidates token
    path('api/auth/register', RegisterApi.as_view()),
    path('api/auth/registerstudent', RegisterStudentApi.as_view()),
    path('api/auth/registerteacher', RegisterTeacherApi.as_view()),
    path('api/auth/user', UserAPI.as_view()),

]

