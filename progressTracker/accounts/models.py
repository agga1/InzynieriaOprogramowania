from django.db import models
from django.contrib.auth.models import AbstractUser

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_index(value: str):
    if len(value) != 6 or not value.isdigit():
        raise ValidationError(
            _(f'%(value)s is not a proper index number, len={len(value)}, isdigit={value.isdigit()}'),
            params={'value': value},
        )

class DefaultUser(AbstractUser):
    is_student = models.BooleanField('student status', default=False)


class Student(models.Model):
    user = models.OneToOneField(DefaultUser, on_delete=models.CASCADE, primary_key=True)
    is_female = models.BooleanField()
    index_nr = models.CharField(verbose_name="Index number", validators=[validate_index], max_length=6)

class Teacher(models.Model):
    class Title(models.TextChoices):
        PROFESSOR = 'PROF', _('professor')
        MASTER = 'MSc', _('master of science')
        BACHELOR = 'BoS', _('bachelor of science')
    user = models.OneToOneField(DefaultUser, on_delete=models.CASCADE, primary_key=True)
    title = models.CharField(max_length=4, choices=Title.choices, default=Title.BACHELOR)
