from django.urls import path
from . import views
app_name = "tools"
urlpatterns = [
    # path("",views.draw,name="draw"),
    path("",views.add_text,name="add_text"),
]