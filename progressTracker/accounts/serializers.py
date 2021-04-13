from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model

from accounts.models import Student, Teacher


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_student')


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Student
        fields = ('__all__')

class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Teacher
        fields = ('__all__')


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {"write_only": True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

class RegisterStudentSerializer(serializers.ModelSerializer):
    user = RegisterUserSerializer()
    class Meta:
        model = Student
        fields = ('index_nr', 'gender', 'user')

    def create(self, validated_data):
        # first create user, then student profile for that user
        user_data = validated_data['user']
        user = get_user_model().objects.create_user(**user_data)
        user.is_student = True
        user.save()
        student = Student.objects.create(user=user, index_nr=validated_data['index_nr'], gender=validated_data['gender'])
        return student

class RegisterTeacherSerializer(serializers.ModelSerializer):
    user = RegisterUserSerializer()
    class Meta:
        model = Teacher
        fields = ('title', 'user')

    def create(self, validated_data):
        # first create user, then teacher profile for that user
        user_data = validated_data['user']
        user = get_user_model().objects.create_user(**user_data)
        user.save()
        teacher = Teacher.objects.create(user=user, title=validated_data['title'])
        return teacher


# Login - one for all
class LoginSerializer(serializers.Serializer):
    """ validating authentication - DefaultUser only"""
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("incorrect credentials")





