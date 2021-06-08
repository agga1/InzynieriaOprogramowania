from rest_framework import serializers
import numpy as np
from accounts.serializers import TeacherSerializer, StudentSerializer
# from sqlalchemy import null

from .models import Task, Course, Grade, Achievement, CourseGroup


# Task Serializers ---------------------------------------------------
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
        print("create")
        task = Task.objects.create(**validated_data)
        task.save()
        self.update_parents(task)
        return task

    def update(self, instance, validated_data):
        Task.objects.filter(pk=instance.id).update(**validated_data)
        task = Task.objects.get(pk=instance.id)
        self.update_parents(task)
        return task

    def update_parents(self, task):
        parent_task = task.parent_task
        if parent_task is None:
            return
        child_tasks = Task.objects.filter(parent_task=parent_task)
        mins = [child.grade_min for child in child_tasks]
        maxs = [child.grade_max for child in child_tasks]
        agg = parent_task.aggregation_method
        if agg == Task.AggregationMethod.AVERAGE:
            Task.objects.filter(pk=parent_task.id).update(grade_min=sum(mins) / len(mins),
                                                          grade_max=sum(maxs) / len(maxs))
        elif agg == Task.AggregationMethod.WEIGHTED_AVERAGE:
            weights = [child.weight for child in child_tasks]
            avg_min = np.average(a=mins, weights=weights)
            avg_max = np.average(a=maxs, weights=weights)
            Task.objects.filter(pk=parent_task.id).update(grade_min=avg_min, grade_max=avg_max)
        elif agg == Task.AggregationMethod.SUM:
            print(f"new grade_max {sum(maxs)} for {parent_task.name}")
            Task.objects.filter(pk=parent_task.id).update(grade_min=sum(mins), grade_max=sum(maxs))
        self.update_parents(task.parent_task)


# Course Serializers ---------------------------------------------------
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
                                       pass_threshold=validated_data['pass_threshold'],
                                       description=validated_data['description'])
        for student in validated_data['student']:
            course.student.add(student)
        course.save()
        return course

    def update(self, instance, validated_data):
        Course.objects.filter(pk=instance.id).update(**validated_data)
        return Course.objects.get(pk=instance.id)


# Grade Serializers ---------------------------------------------------
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


def update_achievements(grade):
    course = grade.course
    achievements = course.achievement_set.all()
    for achievement in achievements:
        if achievement.kind == Achievement.Kind.ALL:
            print("debug: kind all")
            should_get = True
            pass_threshold = course.pass_threshold
            task_set = Task.objects.filter(course=course).filter(parent_task=None)
            if not task_set:
                continue
            for task in task_set:
                parent_grade = Grade.objects.filter(task=task).filter(student=grade.student)
                if not parent_grade:
                    continue
                if not ((parent_grade[0].value / task.grade_max * 100) > pass_threshold):
                    should_get = False
            if should_get:
                achievement.student.add(grade.student)
            # else:
            #     delete_achievement = Achievement.objects.filter(kind=achievement.kind).filter(student=grade.student)
            #     if delete_achievement:
            #         achievement.student.remove(grade.student)

        elif achievement.kind == Achievement.Kind.MAX:
            print("debug: kind max")
            max_grade = grade.task.grade_max
            if grade == max_grade:
                achievement.student.add(grade.student)
            # else:
            #     delete_achievement = Achievement.objects.filter(kind=achievement.kind).filter(student=grade.student)
            #     if delete_achievement:
            #         achievement.student.remove(grade.student)

        elif achievement.kind == Achievement.Kind.BONUS:
            print("debug: kind bonus")
            is_bonus = grade.task.is_extra
            if is_bonus:
                achievement.student.add(grade.student)

        elif achievement.kind == Achievement.Kind.THRESH:
            print("debug: kind thresh")
            threshold = int(achievement.args)
            number = 0
            weights = 0
            task_set = Task.objects.filter(course=course).filter(parent_task=None)
            if not task_set:
                continue
            for task in task_set:
                parent_grade = Grade.objects.filter(task=task)
                if not parent_grade:
                    continue
                number += parent_grade[0].value * task.weight
                weights += task.weight
            if (number / weights) > threshold:
                achievement.student.add(grade.student)
            # else:
            #     delete_achievement = Achievement.objects.filter(kind=achievement.kind).filter(student=grade.student)
            #     if delete_achievement:
            #         achievement.student.remove(grade.student)


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
            update_achievements(grade)
            return
        parent_grade_set = Grade.objects.filter(task=parent_task).filter(student=student)
        if not parent_grade_set:  # create new grade
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
            Grade.objects.filter(pk=parent_grade.id).update(value=values.sum() / len(child_tasks))
        elif agg == Task.AggregationMethod.WEIGHTED_AVERAGE:
            sum_weights = sum([task.weight for task in child_tasks])
            sum_grades_with_weights = sum([grade.value * grade.task.weight for grade in grades])
            avg = sum_grades_with_weights / sum_weights
            Grade.objects.filter(pk=parent_grade.id).update(value=avg)
        elif agg == Task.AggregationMethod.SUM:
            Grade.objects.filter(pk=parent_grade.id).update(value=values.sum())
        self.recalculate_parent(parent_grade)


# Achievement Serializers ---------------------------------------------------
class CreateAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ('course', 'kind', 'args', 'name')

    def create(self, validated_data):
        ach = Achievement.objects.create(**validated_data)
        ach.save()
        return ach


class ListAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ('id', 'course', 'kind', 'args', 'name')


class CourseGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseGroup
        fields = ('id', 'name', 'course', 'student')


class CourseGroupListSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseGroup
        fields = (
            'id', 'name', 'student'
        )


class CreateCourseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseGroup
        fields = (
            'name', 'course', 'student'
        )

    def create(self, validated_data):
        group = CourseGroup.objects.create(name=validated_data['name'], course=validated_data['course'])
        for student in validated_data['student']:
            group.student.add(student)
        group.save()
        return group


class UpdateCourseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseGroup
        fields = (
            'name', 'student'
        )


