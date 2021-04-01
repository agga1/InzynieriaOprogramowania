from django.db import models

# Create your models here.
from accounts.models import Teacher


class Mock(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)


class Course(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)


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
