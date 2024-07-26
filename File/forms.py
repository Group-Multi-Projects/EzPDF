from django import forms
from .models import FileModel
from Account.models import AccountModel

class UploadFileForm(forms.ModelForm):
    username = forms.CharField(max_length=100, required=False)
    
    class Meta:
        model = FileModel
        fields = ['file']
        labels = {
            'file': 'Select your file:',
        }
        widgets = {
            'file': forms.ClearableFileInput(),
        }
    
    def save(self, commit=True):
        # Lấy tài khoản dựa trên tên người dùng
        username = self.cleaned_data.get("username", "")
        try:
            account = AccountModel.objects.get(username=username)
       
        except AccountModel.DoesNotExist:
            account = None
        # Lấy đối tượng FileModel
        file_instance = super().save(commit=False)
        file_instance.account = account
        if commit:
            file_instance.save()
        
        return file_instance
