from .views import SaveAnnotations, GetAnnotations
from django.urls import include, path

urlpatterns = [
    path('saveAnnotations/', SaveAnnotations, name="saveAnnotations"),
    path('getAnnotations/<str:study_id>/',GetAnnotations, name='get_annotations'),
]
