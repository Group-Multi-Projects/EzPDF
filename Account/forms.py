from django import forms
from .models import AccountModel

class SignUpForm(forms.ModelForm):
    password1 = forms.CharField(max_length=100, widget=forms.PasswordInput)
    password2 = forms.CharField(max_length=100, widget=forms.PasswordInput)
    
    class Meta:
        model = AccountModel
        fields = ['email', 'username']

    def validate_password_match(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match")
        return password2

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if AccountModel.objects.filter(username=username).exists():
            raise forms.ValidationError("Username already exists")
        return username

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if AccountModel.objects.filter(email=email).exists():
            raise forms.ValidationError("Email already exists")
        return email

    def save(self, commit=True):
        user = super(SignUpForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

    def clean(self):
        cleaned_data = super().clean()
        self.validate_password_match()
        return cleaned_data

from django.contrib.auth.forms import AuthenticationForm

class SignInForm(AuthenticationForm):
    # email = forms.EmailField(max_length=100)
    password = forms.CharField(max_length=100,widget=forms.PasswordInput)
 
