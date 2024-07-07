import json
from django.http import HttpResponse , JsonResponse 
from django.views.decorators.csrf import csrf_exempt
import requests
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import ExamList, instance_List
from .serializers import CreateexamSerializer
from .serializers import InstanceListSerializer
import threading


# Create your views here.


def create_digital_instance (data_of_breast):
    study_details = instance_List(study=data_of_breast["study"],
                laterality=data_of_breast["laterality"], Type=data_of_breast["Type"], view=data_of_breast["view"], instance_id=data_of_breast["instance_id"])
    
    study_details.save()


def Generate_2d(data):
                code= requests.post(f"http://127.0.0.1:8001/generate",json=data).json()
                print("generation",code)



@login_required(login_url='/authuser/login')
def mainExamlist(request):
    alldata = ExamList.objects.all()
    return render(request, 'base_app.html', {'alldata': alldata})


def get_all_exams(request):
    exams=ExamList.objects.all()
    serializer=CreateexamSerializer(exams,many=True)
    return JsonResponse(serializer.data,safe=False)
    
    
def get_instances(request, study_id):
    study = get_object_or_404(ExamList, Study_Id=study_id)
    exams=instance_List.objects.filter(study=study)
    serializer=InstanceListSerializer(exams,many=True)
    return JsonResponse(serializer.data,safe=False)

def generateCESM(request, study_id):
    study = get_object_or_404(ExamList, Study_Id=study_id)
    instances = study.Instances_Id
    
    for instance in instances:
        deploydata = {"instanceid": instance}
        requests.post(f"http://127.0.0.1:8001/generate",json=deploydata).json()
        
    return JsonResponse("DONE", safe=False)


@csrf_exempt
def newexam(request):
    if request.method == "POST":
        request = json.loads(request.body)
        print(" recieved post ####",request)
        instanceid = request["instanceid"]
        deploydata = {"instanceid": instanceid}
        # check if new study
        tags_response = requests.get(
            f"http://localhost:8042/instances/{instanceid}/simplified-tags")
        json_response = tags_response.json()
        study_id = json_response["StudyInstanceUID"]
        view = json_response["ViewPosition"]
        print(study_id)
        try:
            studies = get_object_or_404(ExamList, Study_Id=study_id)
        except:
            studies = False
        if not studies:  # create new exam
            right_breast = False
            left_breast = False
            class_result = False
            patient_name = json_response["PatientName"]
            patient_id = json_response["PatientID"]
            patient_age = json_response["PatientAge"]
            dr_name = json_response["RequestingPhysician"]
            print(dr_name)# add to dicom tags and extract later
            study_date = json_response["StudyDate"]  # extract later from dicom tags
            result= requests.post(f"http://127.0.0.1:8001/instanceid",json=deploydata).json() # integrate Ai output
            
            classification = result["classification"]
            laterality = result["laterality"]
            print(laterality)
            print(classification)
            print("###############################")
            if laterality == "L" and classification:
                print("left true")
                left_breast =  True
            elif laterality == "R" and classification:
                print("right true")
                right_breast = True
            
            if classification:
                class_result = True
            # classification = False
            cem = False  # integrate model
            new_exam = ExamList(Patient_name=patient_name, Patient_id=patient_id, age=patient_age, Doctor_name=dr_name,
                                Study_Id=study_id, Instances_Id=[instanceid], Date_Study=study_date, Classification=class_result,right_breast= right_breast, left_breast= left_breast, CEM=cem, counter=1)
            new_exam.save()
            
            create_digital_instance(
                {"study": new_exam, "Type": "D", "laterality": laterality, "view": view, "instance_id": instanceid})

            print("addednew exam")
            # generate contrast 
            # if (classification):
            #     code= requests.post(f"http://127.0.0.1:8001/generate",json=deploydata).json()
            #     new_exam.CEM = True
            #     new_exam.save()

        else: 
            # check contrast
            try: 
                print(json_response["ImageType"])
                if json_response["ImageType"]=="DERIVED\SECONDARY":
                    studies.Instances_Id.append(instanceid)
                    studies.CEM = True

                    studies.counter +=1
                    
                    
                    studies.save()

                    create_digital_instance(
                        {"study": studies, "Type": "C", "laterality": json_response["ImageLaterality"], "view": view, "instance_id": instanceid})

                    print("added new contrast image")
                    return HttpResponse("ok")
            except Exception as e: print(e)

            
            print('left try except newinstance in study')
             # append new instance
            studies.Instances_Id.append(instanceid)
            result= requests.post(f"http://127.0.0.1:8001/instanceid",json=deploydata).json() # integrate Ai output
            create_digital_instance(
                {"study": studies, "Type": "D", "laterality": json_response["ImageLaterality"] , "view": view, "instance_id": instanceid})
            
            classification = result["classification"]
            laterality = result["laterality"]
            print(laterality)
            print(classification)
            print("###############################")
            
            if laterality == "L" and classification:
                print("left true")
                left_breast =  True
                studies.left_breast = left_breast
                studies.Classification = True
            elif laterality == "R" and classification:
                print("right true")
                right_breast = True
                studies.right_breast = right_breast
                studies.Classification = True
                
            studies.counter += 1
            
            if studies.Classification and studies.counter == 4:
                studies.Classification = True
                for instance in studies.Instances_Id:
                    deploydata = {"instanceid": instance}
                    requests.post(f"http://127.0.0.1:8001/generate",json=deploydata).json()
            
            
            # if classification:
            #     studies.classification = True
            #     studies.CEM = True
            #     code= requests.post(f"http://127.0.0.1:8001/generate",json=deploydata).json()
            
            
            studies.save()
            print("added new instance")

        return HttpResponse("ok")
    else:
        return HttpResponse("ok")