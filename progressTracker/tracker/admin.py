from django.contrib import admin
# Register your models here.
from accounts.models import DefaultUser, Student, Teacher

admin.site.register(DefaultUser)
admin.site.register(Teacher)
admin.site.register(Student)
