from django.db import models
from django.contrib.auth.models import AbstractUser

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_index(value: str):
    """ check if provided index is valid """
    if len(value) != 6 or not value.isdigit():
        raise ValidationError(
            _(f'%(value)s is not a proper index number, len={len(value)}, isdigit={value.isdigit()}'),
            params={'value': value},
        )


class DefaultUser(AbstractUser):
    """ base user for every user profile - all authentication here """
    is_student = models.BooleanField('student status', default=False)

    def __unicode__(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Student(models.Model):
    """ extends DefaultUser class with extra information about student (no influence on authentication service) """

    class Gender(models.TextChoices):
        MALE = 'M', _('male')
        FEMALE = 'F', _('female')

    user = models.OneToOneField(DefaultUser, on_delete=models.CASCADE, primary_key=True)
    gender = models.CharField(max_length=1, choices=Gender.choices, default=Gender.MALE)
    index_nr = models.CharField(verbose_name="Index number", validators=[validate_index], max_length=6)

    def __unicode__(self):
        return str(self.user)

    def __str__(self):
        return str(self.user)


class Teacher(models.Model):
    """ extends DefaultUser class with extra information about teacher (no influence on authentication service) """

    class Title(models.TextChoices):
        PROFESSOR = 'PROF', _('professor')
        MASTER = 'MSc', _('master of science')
        BACHELOR = 'BoS', _('bachelor of science')

    user = models.OneToOneField(DefaultUser, on_delete=models.CASCADE, primary_key=True)
    title = models.CharField(max_length=4, choices=Title.choices, default=Title.BACHELOR)

    def __unicode__(self):
        return str(self.user)

    def __str__(self):
        return str(self.user)
