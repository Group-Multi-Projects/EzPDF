from django.urls import path
from . import views
app_name = "tools"
urlpatterns = [
    path("draw/",views.draw,name="draw"),
    path("addtext/",views.add_text,name="add_text"),
    path("getalldatas/",views.get_obj_all_changes_event,name="getalldatas"),
    
]