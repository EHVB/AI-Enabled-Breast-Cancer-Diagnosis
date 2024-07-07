from django.shortcuts import render
from .serializers import AnnotationSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Annotations
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from django.shortcuts import render, get_object_or_404
from examlist.models import ExamList
# Create your views here.


@csrf_exempt
def SaveAnnotations (request):
    try:
        # Attempt to parse JSON data
        data = json.loads(request.body.decode('utf-8'))
        study = get_object_or_404(ExamList, Study_Id=data['patientInfo']['Study_Id'])
        try:
            saved_annotations = get_object_or_404(Annotations, study = study)
            saved_annotations.annotations = data['annotations']
            saved_annotations.save()
        except:
            Annotation = data['annotations']
            annotated_data = Annotations(annotations=Annotation, study=study)
            annotated_data.save()
        print("########################################################################")
        return JsonResponse({'status': 'ok'})
    except json.JSONDecodeError as e:
        print("Error decoding JSON: ", e)
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    

@csrf_exempt
def GetAnnotations(request, study_id):
    print(study_id)
    study = get_object_or_404(ExamList, Study_Id=study_id)
    print(study)
    annotations = get_object_or_404(Annotations, study_id=study)
    print("###################################################   Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    print(annotations)
    serializer = AnnotationSerializer(annotations, many=False)
    print(serializer)
    return JsonResponse(serializer.data, safe=False)
