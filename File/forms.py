# forms.py
from django import forms
from .models import FileModel
from Account.models import AccountModel

class UploadFileForm(forms.ModelForm):
    username = forms.CharField(max_length=100)
    
    class Meta:
        model = FileModel
        fields = ['file']
        widgets = {
            'file': forms.ClearableFileInput(attrs={'label': 'Select your file:'}),
        }
    
    def save(self, commit=True):
        # Lấy tài khoản dựa trên tên người dùng
        username = self.cleaned_data["username"]
        account = AccountModel.objects.get(username=username)
        
        # Lấy đối tượng FileModel
        file_instance = super().save(commit=False)
        file_instance.account = account
        
        if commit:
            file_instance.save()
        
        return file_instance
