from rest_framework import serializers
from .models import Mock, Task


class MockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mock
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            'course_id', 'grade_min', 'grade_max', 'is_extra',
            'parent_task_id', 'weight', 'deadline', 'aggregation_method'
        )

    def create(self, validated_data):
        task = Task.objects.create(**validated_data)
        task.save()
        return task
