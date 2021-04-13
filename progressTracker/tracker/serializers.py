from rest_framework import serializers

from accounts.serializers import TeacherSerializer
from .models import Mock, Task, Course, Grade, Prize


class MockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mock
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def create(self, validated_data):
        task = Task.objects.create(**validated_data)
        task.save()
        return task


class CourseDetailSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer()
    class Meta:
        model = Course
        fields = (
            'name', 'pass_threshold', 'teacher',
        )

class CourseListSerializer(serializers.HyperlinkedModelSerializer):
    teacher_name = serializers.CharField(source='teacher', read_only=True)
    class Meta:
        model = Course
        fields = (
            'url', 'name', 'teacher_name'
        )

class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = (
            'name', 'teacher', 'student', 'pass_threshold'
        )

    def create(self, validated_data):
        course = Course.objects.create(name=validated_data['name'], teacher=validated_data['teacher'],
                                       pass_threshold=validated_data['pass_threshold'])
        for student in validated_data['student']:
            course.student.add(student)
        course.save()
        return course


class CreateGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = (
            'task', 'value', 'student', 'course',
            'issued_by'
        )

    def create(self, validated_data):
        grade = Grade.objects.create(**validated_data)
        grade.save()
        return grade


class PrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prize
        fields = (
            'student', 'kind'
        )

    def create(self, validated_data):
        prize = Prize.objects.create(**validated_data)
        prize.save()
        return prize

