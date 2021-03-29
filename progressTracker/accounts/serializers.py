from rest_framework import serializers
# from django.contrib.auth.models import User
from django.contrib.auth import authenticate, get_user_model

from accounts.models import Student
from progressTracker.settings import AUTH_USER_MODEL


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email')


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Student
        fields = ('user', 'index_nr')


class RegisterStudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    password = serializers.CharField(source='user.password')
    class Meta:
        model = Student
        fields = ('index_nr', 'username', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {"write_only": True}}

    def create(self, validated_data):
        # first create user, then student
        user_data = validated_data['user']
        user = get_user_model().objects.create_user(**user_data)
        user.is_student = True
        user.save()
        student = Student.objects.create(user=user, index_nr=validated_data['index_nr'])
        return student


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()  # AUTH_USER_MODEL
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {"write_only": True}}

    def create(self, validated_data):
        print("validated_data", validated_data)
        user = get_user_model().objects.create_user(validated_data['username'],
                                                    validated_data['email'], validated_data['password'],
                                                    first_name=validated_data['first_name'],last_name=validated_data['last_name'])
        return user


class LoginSerializer(serializers.Serializer):  # no model - only validating authentication
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("incorrect credentials")
