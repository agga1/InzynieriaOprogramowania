from django.contrib.auth import login, logout
from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer, RegisterUserSerializer, LoginSerializer, StudentSerializer, \
    RegisterStudentSerializer, RegisterTeacherSerializer, TeacherSerializer


# Student API

class RegisterStudentApi(generics.GenericAPIView):
    serializer_class = RegisterStudentSerializer

    def post(self, request, *args, **kwargs):
        """ register student, returns student and created token. """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        return Response({
            "user": StudentSerializer(student, context=self.get_serializer_context()).data,
        })

# Teacher API

class RegisterTeacherApi(generics.GenericAPIView):
    serializer_class = RegisterTeacherSerializer

    def post(self, request, *args, **kwargs):
        """ register teacher """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        teacher = serializer.save()
        return Response({
            "user": TeacherSerializer(teacher, context=self.get_serializer_context()).data,
        })

# Login Api -- same for all profiles TODO - frontend - possibly Student attributes needed?
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        """ returns user and his token """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
        })

@api_view()
def logout_api(request):
    logout(request)
    return Response({"status": "logged out"})


# ----- API for DefaultUser, use mostly as a template to create API for each user profile

# Register Api
class RegisterApi(generics.GenericAPIView):
    serializer_class = RegisterUserSerializer

    def post(self, request, *args, **kwargs):
        """ register user, returns user and token. """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
        })


# Get user Api
class UserAPI(generics.RetrieveAPIView):
    """ get-only. Returns currently logged in user profile (Student or Teacher) (send token with request)  """
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_serializer_class(self):  # todo check for is_staff? (for admin user)
        if self.request.user.is_student:
            return StudentSerializer
        return TeacherSerializer

    def get_object(self):
        """ looks at the token and returns associated user. """
        if self.request.user.is_student:
            return self.request.user.student
        else:
            return self.request.user.teacher
