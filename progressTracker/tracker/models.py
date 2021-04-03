from django.db import models

# Create your models here.
from accounts.models import Teacher, Student


class Mock(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)


class Course(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    student = models.ManyToManyField(Student)
    pass_threshold = models.SmallIntegerField(default=50)


class Task(models.Model):
    class AggregationMethod(models.TextChoices):
        AVERAGE = 'AVG'
        WEIGHTED_AVERAGE = 'WAVG'

    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    grade_min = models.SmallIntegerField()
    grade_max = models.SmallIntegerField()
    is_extra = models.BooleanField()
    parent_task_id = models.ForeignKey("self", on_delete=models.CASCADE)
    weight = models.FloatField()
    deadline = models.DateTimeField()
    aggregation_method = models.CharField(
        max_length=4, choices=AggregationMethod.choices, default=AggregationMethod.AVERAGE)


class Grade(models.Model):
    task_id = models.ForeignKey(Task, on_delete=models.SET(-1))
    value = models.SmallIntegerField()
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    course_id = models.ForeignKey(Course, on_delete=models.SET(-1))
    issued_by = models.ForeignKey(Teacher, on_delete=models.SET(-1))
    issued_at = models.DateTimeField(auto_now_add=True)


class Prize(models.Model):
    class PrizeKind(models.IntegerChoices):
        DIAMOND = 1
        GOLD = 2
        SILVER = 3
        BRONZE = 4

    student_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    issued_at = models.DateTimeField(auto_now_add=True)
    kind = models.IntegerField(choices=PrizeKind.choices)
