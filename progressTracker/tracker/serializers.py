from rest_framework import serializers
from .models import Mock, Task, Course, Grade, Prize


class MockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mock
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            'course_id', 'grade_min', 'grade_max', 'is_extra',
            'parent_task_id', 'weight', 'deadline', 'aggregation_method'
        )

    def create(self, validated_data):
        task = Task.objects.create(**validated_data)
        task.save()
        return task


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = (
            'name', 'teacher', 'student', 'pass_threshold'
        )

    def create(self, validated_data):
        course = Course.objects.create(name=validated_data['name'], teacher=validated_data['teacher'],
                                       pass_threshold=validated_data['pass_threshold'])
        course.save()
        for student in validated_data['student']:
            course.student.add(student)
        course.save()
        return course


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = (
            'task_id', 'value', 'student_id', 'course_id',
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
            'student_id', 'kind'
        )

    def create(self, validated_data):
        prize = Prize.objects.create(**validated_data)
        prize.save()
        return prize
