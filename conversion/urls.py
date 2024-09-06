
from django.contrib import admin
from django.urls import path, include
from . import views
app_name = "conversion"
urlpatterns = [
    path("convert_file_after_login/<str:type>/",views.convert_file_after_login,name = "convert_file_after_login"),
    path("convert_file_before_login/<str:type>/",views.convert_file_before_login,name = "convert_file_before_login"),
    path("converted/<str:filename>/",views.converted,name = "converted"),
]
