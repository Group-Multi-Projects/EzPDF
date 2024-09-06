from django.shortcuts import render, redirect
from .forms import SignUpForm, SignInForm
from .models import AccountModel
from django.contrib.auth import login,authenticate,logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
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
    form =SignInForm()
    if request.method == 'POST':
        email_login = request.POST.get("email_login")
        password_login = request.POST.get("password_login")
        form = SignInForm(request, data=request.POST)
        user = authenticate(request, username=email_login, password=password_login)
        if user is not None:
            login(request, user)
            if next:
                return redirect(next)
            return redirect('File:list_files')
        # if form.is_valid():
            # email = form.cleaned_data['username']
            # password = form.cleaned_data['password']
            # email = email_login
            # password = password_login
            # user = authenticate(request, username=email, password=password)
            # if user is not None:
            #     login(request, user)
            #     if next:
            #         return redirect(next)
            #     return redirect('File:list_files')
    # else:
    #     form = SignInForm()
    context = {
        "form_signin":form
    }
    return render(request,"File/index.html",context)
def signout(request):
    logout(request)
    return redirect("File:index")

