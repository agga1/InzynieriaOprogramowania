from rest_framework import serializers
from .models import Mock

class MockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mock
        fields = '__all__'