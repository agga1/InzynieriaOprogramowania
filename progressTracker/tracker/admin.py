from django.contrib import admin
# Register your models here.
from accounts.models import DefaultUser, Student, Teacher
from django.contrib.auth.admin import UserAdmin


class CustomAdmin(UserAdmin):
    pass


admin.site.register(DefaultUser, CustomAdmin)
admin.site.register(Teacher)
admin.site.register(Student)
