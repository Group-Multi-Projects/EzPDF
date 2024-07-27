from django.db import models
from Account.models import AccountModel
# Create your models here.
class FileModel(models.Model):
    account = models.ForeignKey(AccountModel,on_delete=models.PROTECT,null=True)
    file = models.FileField(upload_to="files/",null=True)
    file_format = models.CharField(verbose_name="Format",max_length=20,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.file}.{self.file_format}"
    
    def get_file_path(self):
        return self.file
    
    def get_account(self):
        return self.account