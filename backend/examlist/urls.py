from .views import mainExamlist, newexam , get_all_exams, get_instances, generateCESM
from django.urls import include, path

urlpatterns = [
    path('', mainExamlist, name="mainExamlist"),
    path('newexam', newexam, name="newinstance"),
    path('allexams', get_all_exams, name="allexams"),
    path('instance-list/<str:study_id>/', get_instances, name='instance-list-by-study-id'),
    path('generate-cesm/<str:study_id>/', generateCESM, name='generate')
]
