from django import forms
from .models import ConversionModel
from Account.models import AccountModel
class ConversionForm(forms.Form):
    original_file = forms.FileField()
    def get_file_path(self, request):
        return self.original_file.path
    def save(self,request):
        
        # Tạo hoặc lấy đối tượng ConversionModel
        account =   AccountModel.objects.get(username = request.user.username)
        conversion, created = ConversionModel.objects.get_or_create(
            account = account,
            original_file=self.cleaned_data["original_file"],
        )
        
        # Lấy đường dẫn của original_file
        original_file_path = conversion.original_file.path
        
        return original_file_path
