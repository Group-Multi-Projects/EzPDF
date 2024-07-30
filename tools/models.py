from django.db import models
from File.models import FileModel

# Create your models here.
class ToolModel(models.Model):
    file = models.ForeignKey(FileModel, on_delete=models.PROTECT)
    page = models.IntegerField("Location in the page")
    priority = models.IntegerField("Priority",unique=True)
    tool_type = models.CharField(verbose_name="Type of tools", max_length=20, default="Draw")
    created_at = models.DateTimeField(verbose_name="Created at",auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Updated_at",auto_now=True)
    class Meta:
        abstract = True  # Ensure this model is abstract and won't create a separate table

class DrawModel(ToolModel):
    coordinates = models.TextField(verbose_name="Coordinates")

    def __str__(self):
        return self.tool_type

class TextModel(models.Model):
    pass