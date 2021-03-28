from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
def validate_index(value: str):
    if len(value) != 6 or value.isdigit():
        raise ValidationError(
            _('%(value)s is not a proper index number'),
            params={'value': value},
        )

class DefaultUser(AbstractUser):
    is_student = models.BooleanField('student status', default=False)


class Student(models.Model):
    user = models.OneToOneField(DefaultUser, on_delete=models.CASCADE, primary_key=True)
    index_nr = models.CharField(verbose_name="Index number", validators=[validate_index], max_length=6)
