from django.urls import path
from . import views
app_name = "tools"
urlpatterns = [
    # path("draw/",views.draw_save_data,name="draw"),
    # path("addtext/",views.add_text_save_data,name="add_text"),
    path("getalldatas/",views.get_obj_all_changes_event,name="getalldatas"),
    path("tools_api/",views.get_post_tools_api,name="tools_api"),
    path("tools_api/<str:item_id>/",views.get_delete_tools_api),
    path("draw_added_api/<int:id>/",views.get_draw_added_api,name="draw_added_api_filter"),
    path("text_added_api/<int:id>/",views.get_text_added_api,name="text_added_api_filter"),
    path("image_added_api/<int:id>/",views.get_image_added_api,name="image_added_api_filter"),
    path("shape_added_api/<int:id>/",views.get_shape_added_api,name="shape_added_api_filter"),
    path('test_celery/',views.test_celery),

]