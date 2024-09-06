from django.shortcuts import render, redirect
from pdf2docx import Converter as WordConverter
import os
from django.conf import settings
from .forms import ConversionForm
from .models import ConversionModel
def convert_file_after_login(request, type):
    form = ConversionForm()
    if type == "pdf2word":
        docx_file = os.path.join(settings.MEDIA_ROOT,'files', 'converted_files', 'output.docx')
        docx_file = docx_file.replace("/", "\\")

        if request.method == "POST":
            form = ConversionForm(request.POST,request.FILES)
            if form.is_valid():
                input_file_path = form.save(request)
                input_file_path = input_file_path.replace("/", "\\")
                pdf_to_word(input_file_path, docx_file)
                print("Input file:",input_file_path)
                print("Basename:",os.path.basename(docx_file))
                return redirect("conversion:converted", filename=os.path.basename(input_file_path))
    context = {
        "form":form,
        "type": type,
        "docx_path": docx_file
    }
    return render(request, "conversion/conversion.html", context)

def convert_file_before_login(request, type):
    form = ConversionForm()
    if type == "pdf2word":
        docx_file = os.path.join(settings.MEDIA_ROOT,'files', 'converted_files', 'output.docx')
        docx_file = docx_file.replace("/", "\\")

        if request.method == "POST":
            form = ConversionForm(request.POST,request.FILES)
            if form.is_valid():
                input_file_path = input_file_path.replace("/", "\\")
                pdf_to_word(input_file_path, docx_file)
                print("Input file:",input_file_path)
                print("Basename:",os.path.basename(docx_file))
                return redirect("conversion:converted", filename=os.path.basename(input_file_path))
    context = {
        "form":form,
        "type": type,
        "docx_path": docx_file
    }
    return render(request, "conversion/conversion_before_login.html", context)

def converted(request, filename):
    print(filename)
    file_path = filename.replace("\\", "/")
    
    context = {
        "file_name": filename,
        "file_path": file_path
    }
    return render(request, "conversion/converted.html", context)

def pdf_to_word(pdf_file_path, word_file_path):
    cv = WordConverter(pdf_file_path)
    cv.convert(word_file_path, start=0, end=None)
    cv.close()
