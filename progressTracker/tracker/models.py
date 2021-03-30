from django.db import models

# Create your models here.
from accounts.models import Teacher


class Mock(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

# class Course(models.Model):
#     name = models.CharField(max_length=100)
#     teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
