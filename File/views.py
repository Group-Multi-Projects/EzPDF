from django.shortcuts import render, redirect, get_object_or_404
from .forms import UploadFileForm
import os
import requests
from .models import FileModel
import logging
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from rest_framework.response import Response
from. serializers import FileSerializer
from rest_framework.permissions import IsAuthenticated
from Account.models import AccountModel
from django.contrib.auth.decorators import login_required
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from tools.models import TextModel,DrawModel
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
logger = logging.getLogger(__name__)
# Create your views here.
def index(request):
    if request.user.is_authenticated:
        return redirect("File:home")
    else:
        return render(request, "File/main_index.html")

@login_required(login_url=settings.LOGIN_URL)
def home(request):
    return render(request,"File/home.html")
def list_files(request):
    account = AccountModel.objects.get(username = request.user.username)
    print(account.email)
    files = FileModel.objects.filter(
        account = account,
        trash = 0
    )
    refresh = RefreshToken.for_user(account)

    print(files)
    context = {
        "files":files,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    return render(request,"File/project_after_login.html",context)
def get_jwt_token(username, password):
    url = 'http://127.0.0.1:8000/auth/api/token/'
    data = {
        'username': username,
        'password': password
    }
    response = requests.post(url, data=data)
    
    if response.status_code == 200:
        tokens = response.json()
        return tokens['access'], tokens['refresh']
    else:
        print(f"Error: {response.status_code}")
        return None, None

def edit_file(request, file_id):
    file = get_object_or_404(FileModel, id=file_id)
 
    file_path = file.get_file_path()
    textboxs = TextModel.objects.filter(
        file = file
    )
    num_pages = file.get_num_pages()
    account = AccountModel.objects.get(username = request.user.username)

    refresh = RefreshToken.for_user(account)

    context = {
        'textboxs':textboxs,
        "file": file,
        "file_path":file_path,
        "num_pages":num_pages,
        'refresh': str(refresh),
        'access': str(refresh.access_token),    
    }
    return render(request, "File/edit_file.html", context)

def upload_file(request):
    if request.method == 'POST':
        try:
            username = request.user.username
        except AccountModel.DoesNotExist:
            form = UploadFileForm(request.POST, request.FILES) 
        else:
            form = UploadFileForm(request.POST, request.FILES)
        
        if form.is_valid():
            uploaded_file = form.save(commit=True,username = username)
            logger.info(f"Uploaded file ID: {uploaded_file.id}")
            return redirect('File:edit_file', file_id=uploaded_file.id)
        else:
            logger.warning("Upload form is not valid")
            return render(request, 'File/upload_file.html', {'form': form})
    else:
        form = UploadFileForm()

    context = {
        "form": form,
        "link":'File:upload_file',
    }
    return render(request, 'File/upload_file.html', context)

@api_view(["GET","POST"])
@permission_classes([IsAuthenticated]) 
def get_post_file_api(request):
    if request.method == "GET":
        model = FileModel.objects.all()
        serializers = FileSerializer(model,many = True)
        return Response(serializers.data)
    
    elif request.method == "POST":
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return redirect("File:list_files")

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def get_put_delete_file_api(request, id):
    model = get_object_or_404(FileModel, id=id)

    if request.method == "GET":
        serializer = FileSerializer(model)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = FileSerializer(model, data=request.data)
        print("geellsadlasd")
        if serializer.is_valid():
            serializer.save()
            # return Response(serializer.data, status=status.HTTP_200_OK)
            return redirect('File:list')
    elif request.method == "DELETE":
        model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def get_list_files(request,page_type):
    if request.method == "GET":
        try:
            account = AccountModel.objects.get(username=request.user.username)
            if page_type == "files":
                files = FileModel.objects.filter(
                    account=account,
                    trash = 0
                    )
            elif page_type == "trash":
                files = FileModel.objects.filter(
                    account=account,
                    trash = 1
                    )
            serializers = FileSerializer(files, many=True)
            return Response({"list_files": serializers.data}, status=status.HTTP_200_OK)
        except AccountModel.DoesNotExist:
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == "POST":
        # Xử lý dữ liệu POST ở đây nếu cần
        return Response({"message": "POST method is not implemented"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



def trash_view(request):
    account = AccountModel.objects.get(username = request.user.username)
    print(account.email)
    files = FileModel.objects.filter(
        account = account,
        trash = 1
    )
    refresh = RefreshToken.for_user(account)

    print(files)
    context = {
        "files":files,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    return render(request,"File/trash.html",context)
@csrf_exempt  
def add_to_trash(request, id):
    if request.method == "POST":
        file = get_object_or_404(FileModel, id=id)
        file.trash = 1
        file.save()
        return JsonResponse({"status": "true"})
    return JsonResponse({"status": "false", "message": "Invalid request method."}, status=400)