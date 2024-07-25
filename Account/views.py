from django.shortcuts import render, redirect
from .forms import SignUpForm, SignInForm
from .models import AccountModel
from django.contrib.auth import login,authenticate,logout
def signup(request):
    if request.method == "POST":
        form = SignUpForm(request.POST,request.FILES)
        if form.is_valid():
            form.save()
            return redirect("File:home")
    else:
        form = SignUpForm()
    context = {
        "form":form
    }
    return render(request,"Account/signup.html",context)

def signin(request):
    if request.method == 'POST':
        form = SignInForm(request, data=request.POST)
        if form.is_valid():
            email = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('File:list_files')
    else:
        form = SignInForm()
    context = {
        "form":form
    }
    return render(request,"Account/signin.html",context)
def signout(request):
    logout(request)
    return redirect("File:home")