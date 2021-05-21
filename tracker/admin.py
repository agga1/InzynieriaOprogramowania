from django.contrib import admin
from django.contrib.auth.models import Group
from accounts.models import DefaultUser, Student, Teacher
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm


class DefaultUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = DefaultUser

class StudentInline(admin.StackedInline):
    model = Student
    min_num = 1

class TeacherInline(admin.StackedInline):
    model = Teacher
    min_num = 1

class DefaultUserAdmin(UserAdmin):
    form = DefaultUserChangeForm
    exclude = ('groups', )
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (('Permissions'), {
            'fields': ('is_active',),
        }),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2','first_name', 'last_name', 'email'),
        }),
    )

class StudentUser(DefaultUser):
    class Meta:
        proxy = True
        verbose_name = 'Student'
        verbose_name_plural = 'Students'

class StudentUserAdmin(DefaultUserAdmin):
    inlines = [StudentInline,]

    def get_queryset(self, request):
        return DefaultUser.objects.filter(is_student=True)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        DefaultUser.objects.filter(pk=obj.id).update(is_student=True)
        group = Group.objects.get(name="StudentGroup")
        group.user_set.add(obj.id)

class TeacherUser(DefaultUser):
    class Meta:
        proxy = True
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'

class TeacherUserAdmin(DefaultUserAdmin):
    inlines = [TeacherInline,]

    def get_queryset(self, request):
        return DefaultUser.objects.filter(is_student=False)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        group = Group.objects.get(name="TeacherGroup")
        group.user_set.add(obj.id)


# admin.site.register(DefaultUser, DefaultUserAdmin)
admin.site.register(StudentUser, StudentUserAdmin)
admin.site.register(TeacherUser, TeacherUserAdmin)
# admin.site.register(Teacher)
# admin.site.register(Student)
