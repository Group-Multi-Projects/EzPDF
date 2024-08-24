
from django.contrib import admin
from django.urls import path, include
from . import views
app_name = "File"
urlpatterns = [
    path("listfiles/",views.list_files,name="list_files"),
    path("edit/<int:file_id>/",views.edit_file,name="edit_file"),
    path("upload_file/",views.upload_file,name="upload_file"),
    path("",views.home,name="home"),
    path('file_api/',views.get_post_file_api,name="get_post_api"),
    path('file_api/<int:id>/',views.get_put_delete_file_api,name="get_put_delete_api"),
    # path('get_access_token/',views.get_access_token,name="access_token")
    path("index/",views.index)
]
