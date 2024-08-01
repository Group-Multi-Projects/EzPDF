from django.urls import path
from . import views
app_name = "tools"
urlpatterns = [
    path("draw/",views.draw,name="draw"),
    path("addtext/",views.add_text,name="add_text"),
    path("getalldatas/",views.get_obj_all_changes_event,name="getalldatas"),
    path("tools_api/",views.get_post_tools_api,name="tools_api"),
    path("tools_api/<int:id>/",views.get_put_delete_tools_api,name="tools_api_filter"),
    
]