from django.urls import path, include
from .api import RegisterApi, LoginAPI, UserAPI, RegisterStudentApi, RegisterTeacherApi
from knox import views as knox_views

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(),  name='knox_logout'),  # default logout, invalidates token
    path('api/auth/register', RegisterApi.as_view()),
    path('api/auth/registerstudent', RegisterStudentApi.as_view()),
    path('api/auth/registerteacher', RegisterTeacherApi.as_view()),
    path('api/auth/user', UserAPI.as_view()),

]

