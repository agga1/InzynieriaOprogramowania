from django.contrib import admin
# Register your models here.
from accounts.models import DefaultUser, Student, Teacher
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm

class DefaultUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = DefaultUser

class DefaultUserAdmin(UserAdmin):
    form = DefaultUserChangeForm

    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('is_student',)}),
    )

admin.site.register(DefaultUser, DefaultUserAdmin)
admin.site.register(Teacher)
admin.site.register(Student)
