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
    class Meta:
        model = Student
        fields = ('id', 'username', 'email', 'index_nr')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model() #  AUTH_USER_MODEL
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {"write_only": True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(validated_data['username'],
                                        validated_data['email'], validated_data['password'])
        return user

class LoginSerializer(serializers.Serializer):  # no model - only validating authentication
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("incorrect credentials")

