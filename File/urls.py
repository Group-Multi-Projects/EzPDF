
from django.contrib import admin
from django.urls import path, include
from . import views
app_name = "File"
urlpatterns = [
    path("listfiles/",views.list_files,name="list_files"),
    path("trash/",views.trash_view,name="trash_view"),
    path("edit/<int:file_id>/",views.edit_file,name="edit_file"),
    path("upload_file/",views.upload_file,name="upload_file"),
    path("home/",views.home,name="home"),
    path("",views.index,name="index"),
    path('file_api/',views.get_post_file_api,name="get_post_api"),
    path('file_api/<int:id>/',views.get_put_delete_file_api,name="get_put_delete_api"),
    path("index/",views.index),
    path("get_list_files/<str:page_type>/",views.get_list_files,name="get_list_files"),
    path('trash/<int:id>/',views.add_to_trash,name="add_to_trash"),
]
