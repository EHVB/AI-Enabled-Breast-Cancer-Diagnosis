# from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from examlist.models import ExamList
from examlist.models import instance_List

#    Patient_name = models.CharField(max_length=100)
#     Patient_id = models.CharField(max_length=100)
#     age = models.CharField(max_length=100)
#     Doctor_name = models.CharField(max_length=100)
#     Study_Id = models.CharField()
#     Instances_Id = ArrayField(models.CharField(max_length=50))
#     Date_Study = models.DateField()
#     CEM = models.BooleanField()
#     Classification = ArrayField(models.BooleanField())

class CreateexamSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = ExamList
        fields = ['Patient_name', 'Patient_id', 'age', 'Doctor_name', 'Study_Id','Instances_Id','Date_Study','CEM','Classification', "left_breast", "right_breast"]
        
class InstanceListSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = instance_List
        fields = ['laterality', 'Type', 'view', 'instance_id', 'study_id']