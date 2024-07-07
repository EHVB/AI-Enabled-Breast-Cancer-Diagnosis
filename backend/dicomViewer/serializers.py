from rest_framework import serializers
from .models import Annotations


class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotations
        fields = '__all__'
