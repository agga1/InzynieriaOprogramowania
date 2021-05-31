from django.db import models
from accounts.models import Teacher, Student
from django.utils.translation import gettext_lazy as _


class Course(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    student = models.ManyToManyField(Student, blank=True)
    pass_threshold = models.SmallIntegerField(default=0)
    description = models.TextField(default="")

    def __str__(self):
        return str(vars(self))

class CourseGroup(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ManyToManyField(Student, blank=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return str(vars(self))

class Task(models.Model):
    class AggregationMethod(models.TextChoices):
        SUM = 'SUM'
        AVERAGE = 'AVG'
        WEIGHTED_AVERAGE = 'WAVG'

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    grade_min = models.SmallIntegerField()
    grade_max = models.SmallIntegerField()
    is_extra = models.BooleanField()
    parent_task = models.ForeignKey("self", on_delete=models.CASCADE, blank=True, null=True)
    weight = models.FloatField()
    deadline = models.DateTimeField()
    description = models.TextField(default="")
    aggregation_method = models.CharField(max_length=4, choices=AggregationMethod.choices,
                                          default=AggregationMethod.AVERAGE)

    def __str__(self):
        return str(vars(self))


class Grade(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    value = models.SmallIntegerField()
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    issued_by = models.ForeignKey(Teacher, on_delete=models.SET(-1))
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('task', 'student')

    def __str__(self):
        return str(vars(self))

class Achievement(models.Model):
    class Kind(models.TextChoices):
        ALL = 'ALL', _('pass all tasks')
        MAX = 'MAX', _('get 100% from task x')
        THRESH = 'THRESH', _('get x% from course')
        BONUS = 'BONUS', _('complete bonus task')
        STREAK = 'STREAK', _('100% from 3 tasks within a month')

    class Meta:
        unique_together = ('course', 'kind', 'args',)

    def __str__(self):
        return str(vars(self))


    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ManyToManyField(Student, blank=True)
    name = models.CharField(max_length=100)
    kind = models.CharField(max_length=10, choices=Kind.choices)
    args = models.CharField(max_length=100, default="")

