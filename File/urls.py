
from django.contrib import admin
from django.urls import path, include
from . import views
app_name = "File"
urlpatterns = [
    path("listfiles/",views.list_files,name="list_files"),
    path("edit/",views.edit_file,name="edit_file"),
    path("upload_file/",views.upload_file,name="upload_file"),
    path("",views.home,name="home"),
    
]
