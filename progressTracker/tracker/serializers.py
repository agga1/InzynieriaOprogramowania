from django.db.models import IntegerField, IntegerChoices
from rest_framework import serializers
import numpy as np
from accounts.serializers import TeacherSerializer
from .models import Mock, Task, Course, Grade, Achievement


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
            'name', 'pass_threshold', 'teacher', 'description'
        )


class CourseListSerializer(serializers.HyperlinkedModelSerializer):
    teacher_name = serializers.CharField(source='teacher', read_only=True)

    class Meta:
        model = Course
        fields = (
            'url', 'name', 'teacher_name', 'description'
        )


class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = (
            'name', 'teacher', 'student', 'pass_threshold', 'description'
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
            'id', 'student', 'student_name', 'value'
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
        print("create")
        grade = Grade.objects.create(**validated_data)
        grade.save()
        self.recalculate_parent(grade)
        return grade

    def update(self, instance, validated_data):
        print("update")
        Grade.objects.filter(pk=instance.id).update(**validated_data)
        if 'value' in validated_data.keys():
            self.recalculate_parent(instance)
        return Grade.objects.get(pk=instance.id)


    def recalculate_parent(self, grade):
        student = grade.student
        parent_task = grade.task.parent_task
        if parent_task is None:  # highest level already - update achievements
            self.update_achievements(grade)
            return
        parent_grade_set = Grade.objects.filter(task=parent_task).filter(student=student)
        if not parent_grade_set:
            parent_grade = Grade.objects.create(task=parent_task, value=parent_task.grade_min,
                                         student=student, course=grade.course,
                                         issued_by=grade.issued_by)
            parent_grade.save()
        else:
            parent_grade = parent_grade_set[0]
        child_tasks = Task.objects.filter(parent_task=parent_task)
        grades = Grade.objects.filter(student=student).filter(task__in=child_tasks)
        values = np.array([grade.value for grade in grades])
        agg = parent_task.aggregation_method
        if agg == Task.AggregationMethod.AVERAGE:
            Grade.objects.filter(pk=parent_grade.id).update(value=values.mean())
        elif agg == Task.AggregationMethod.WEIGHTED_AVERAGE:
            weights = np.array([grade.task.weight for grade in grades])
            Grade.objects.filter(pk=parent_grade.id).update(value=np.average(values, weights))
        elif agg == Task.AggregationMethod.SUM:
            Grade.objects.filter(pk=parent_grade.id).update(value=values.sum())
        self.recalculate_parent(parent_grade)

    def update_achievements(self, grade):
        course = grade.course
        pass # todo implement


class CreateAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ('course', 'kind', 'args')

    def create(self, validated_data):
        ach = Achievement.objects.create(**validated_data)
        ach.save()
        return ach

class ListAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ('id', 'course', 'kind', 'args')
