from django.db import models
from File.models import FileModel
import os
from Account.models import AccountModel
# Create your models here.
class ConversionModel(models.Model):
    account = models.ForeignKey(AccountModel,on_delete=models.CASCADE,null=True)
    original_file = models.FileField(upload_to="files/original_files/")
    convert_type = models.CharField(max_length=50,null=True)
    created_at = models.DateTimeField(verbose_name="Created At", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Updated At", auto_now=True)
    converted_file = models.FileField(upload_to="files/converted_files/",null=True)
    def __str__(self):
        return f"{os.path.basename(self.original_file)}{self.convert_type}"