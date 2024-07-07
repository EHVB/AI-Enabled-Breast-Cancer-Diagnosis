from django.db import models
from django.contrib.postgres.fields import ArrayField
# Create your models here.


class ExamList(models.Model):
    Patient_name = models.CharField(max_length=100)
    Patient_id = models.CharField(max_length=100)
    age = models.CharField(max_length=100)
    Doctor_name = models.CharField(max_length=100)
    Study_Id = models.CharField()
    Instances_Id = ArrayField(models.CharField(max_length=50))
    Date_Study = models.DateField()
    CEM = models.BooleanField()
    Classification = models.BooleanField()
    right_breast = models.BooleanField()
    left_breast = models.BooleanField()
    counter = models.IntegerField(null=True)

class instance_List(models.Model):
    study = models.ForeignKey(
        ExamList, on_delete=models.CASCADE, related_name='study_id')
    laterality = models.CharField()
    Type = models.CharField()
    view = models.CharField()
    instance_id =  models.CharField()
