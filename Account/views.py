from django.shortcuts import render, redirect
from .forms import SignUpForm, SignInForm
from .models import AccountModel
from django.contrib.auth import login,authenticate,logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib import messages
from rest_framework_simplejwt.tokens import RefreshToken

def signup(request):
    form = SignUpForm()

    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("File:home")
    else:
        form = SignUpForm()
    
    context = {
        "form_signup":form
    }
    return render(request,"File/index.html",context)

def signin(request):
    next = request.GET.get("next")
    form = SignInForm()

    if request.method == 'POST':
        email_login = request.POST.get("email_login")
        password_login = request.POST.get("password_login")
        form = SignInForm(request, data=request.POST)
        
        user = authenticate(request, username=email_login, password=password_login)
        
        if user is not None:
            login(request, user)
            # Thêm thông báo cho người dùng
            messages.success(request, "Đăng nhập thành công!")
            refresh = RefreshToken.for_user(user)
            print(refresh.access_token)
            # Sử dụng resolve_url để xử lý URL an toàn hơn
            if next:
                return redirect(next)
            
            return redirect('File:list_files')
        else:
            # Nếu xác thực thất bại, thêm thông báo lỗi
            messages.error(request, "Email hoặc mật khẩu không đúng!")

    context = {
        "form_signin": form,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    return render(request, "File/index.html", context)
def signout(request):
    logout(request)
    return redirect("File:index")

def profile(request):

    return render(request,"Account/profile.html")

from django.http import JsonResponse

def get_user_info(request):
    if request.method == "GET":
        account = AccountModel.objects.get(username = request.user.username)
        user_info = {
            "username": account.username,
            "email": account.email
        }
        return JsonResponse(user_info)
    return render(request,"Account/profile.html")
