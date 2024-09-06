
from django.contrib import admin
from django.urls import path, include
from . import views
app_name = "Account"
urlpatterns = [
    path("signup/",views.signup,name="signup"),
    path("signin/",views.signin,name="signin"),
    path("signout/",views.signout,name="signout"),
    path("profile/",views.profile,name="profile"),
    path("get_user_info/",views.get_user_info,name="get_user_info"),
    # path('api/login/', views.login_view, name='login_api'),
]
