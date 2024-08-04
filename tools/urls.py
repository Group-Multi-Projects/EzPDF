from django.urls import path
from . import views
app_name = "tools"
urlpatterns = [
    # path("draw/",views.draw_save_data,name="draw"),
    # path("addtext/",views.add_text_save_data,name="add_text"),
    path("getalldatas/",views.get_obj_all_changes_event,name="getalldatas"),
    path("tools_api/",views.get_post_tools_api,name="tools_api"),
    path("text_added_api/<int:id>/",views.get_put_delete_text_added_api,name="text_added_api_filter"),
    path("image_added_api/<int:id>/",views.get_put_delete_image_added_api,name="image_added_api_filter"),
    
]