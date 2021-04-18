from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterUserSerializer, LoginSerializer, StudentSerializer, \
    RegisterStudentSerializer, RegisterTeacherSerializer, TeacherSerializer


# Student API

class RegisterStudentApi(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAdminUser
    ]
    serializer_class = RegisterStudentSerializer

    def post(self, request, *args, **kwargs):
        """ register student, returns student and created token. """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        _, token = AuthToken.objects.create(student.user)
        return Response({
            "user": StudentSerializer(student, context=self.get_serializer_context()).data,
            "token": token
        })

# Teacher API

class RegisterTeacherApi(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAdminUser
    ]
    serializer_class = RegisterTeacherSerializer

    def post(self, request, *args, **kwargs):
        """ register teacher """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        teacher = serializer.save()
        _, token = AuthToken.objects.create(teacher.user)
        return Response({
            "user": TeacherSerializer(teacher, context=self.get_serializer_context()).data,
            "token": token
        })

# Login Api -- same for all profiles TODO - frontend - possibly Student attributes needed?
class LoginAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.AllowAny,
    ]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        """ returns user and his token """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token
        })


# ----- API for DefaultUser, use mostly as a template to create API for each user profile

# Register Api
class RegisterApi(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAdminUser
    ]
    serializer_class = RegisterUserSerializer

    def post(self, request, *args, **kwargs):
        """ register user, returns user and token. """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token
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
