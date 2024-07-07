from django.db import models
from examlist.models import ExamList
# Create your models here.


class Annotations (models.Model):
    study = models.ForeignKey(
        ExamList, on_delete=models.CASCADE, related_name='studyId')

    annotations = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
