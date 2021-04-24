from django.db.models import IntegerField, IntegerChoices
from rest_framework import serializers

from accounts.serializers import TeacherSerializer
from .models import Mock, Task, Course, Grade, Prize


class MockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mock
        fields = '__all__'


class TaskListSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ('url', 'name', 'deadline', 'parent_task')


class TaskMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('url', 'name', 'deadline', 'grade_max')


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def create(self, validated_data):
        task = Task.objects.create(**validated_data)
        task.save()
        return task

    def update(self, instance, validated_data):
        Task.objects.filter(pk=instance.id).update(**validated_data)
        return Task.objects.get(pk=instance.id)


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

    def update(self, instance, validated_data):
        Course.objects.filter(pk=instance.id).update(**validated_data)
        return Course.objects.get(pk=instance.id)


class GradeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = (
            'task', 'value', 'student', 'course', 'issued_by'
        )


class GradeMinimalSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student', read_only=True)

    class Meta:
        model = Grade
        fields = (
            'student', 'student_name', 'value'
        )


class GradeListSerializer(serializers.HyperlinkedModelSerializer):
    issued_by_name = serializers.CharField(source='issued_by', read_only=True)
    student_name = serializers.CharField(source='student', read_only=True)
    task_name = serializers.CharField(source='task.name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Grade
        fields = (
            'url', 'task_name', 'value', 'student_name', 'course_name', 'issued_by_name'
        )


class CreateGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = (
            'task', 'value', 'student', 'course', 'issued_by'
        )

    def create(self, validated_data):
        grade = Grade.objects.create(task=validated_data['task'], value=validated_data['value'],
                                     student=validated_data['student'], course=validated_data['course'],
                                     issued_by=validated_data['issued_by'])
        grade.save()
        return grade

    def update(self, instance, validated_data):
        Grade.objects.filter(pk=instance.id).update(**validated_data)
        return Grade.objects.get(pk=instance.id)


class PrizeDetailSerializer(serializers.ModelSerializer):
    kind_name = serializers.CharField(source='get_kind_display', read_only=True)

    class Meta:
        model = Prize
        fields = (
            'student', 'course', 'issued_at', 'kind', 'kind_name'
        )


class PrizeListSerializer(serializers.HyperlinkedModelSerializer):
    student_name = serializers.CharField(source='student', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    kind_name = serializers.CharField(source='get_kind_display', read_only=True)

    class Meta:
        model = Prize
        fields = (
            'url', 'student_name', 'course_name', 'kind_name'
        )


class CreatePrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prize
        fields = (
            'student', 'kind', 'course'
        )

    def create(self, validated_data):
        prize = Prize.objects.create(student=validated_data['student'], kind=validated_data['kind'],
                                     course=validated_data['course'])
        prize.save()
        return prize

    def update(self, instance, validated_data):
        Prize.objects.filter(pk=instance.id).update(**validated_data)
        return Prize.objects.get(pk=instance.id)
