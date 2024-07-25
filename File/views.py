from django.shortcuts import render,redirect
from .forms import UploadFileForm
import os
# Create your views here.
def home(request):
    return render(request,"File/home.html")
def list_files(request):
    return render(request,"File/list_files.html")
def edit_file(request):
    
    return render(request,"File/edit_file.html")
def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()  
            return redirect('File:edit_file')
        else:
            return render(request, 'File/upload_file.html', {'form': form})
    else:
        form = UploadFileForm()
    context = {
        "form":form
    }
    return render(request, 'File/upload_file.html', context)