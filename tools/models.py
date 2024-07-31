from django.db import models
from File.models import FileModel

# Create your models here.
class ToolModel(models.Model):
    file = models.ForeignKey(FileModel, on_delete=models.PROTECT, verbose_name="File")
    page = models.IntegerField(verbose_name="Page Number")
    # priority = models.IntegerField(verbose_name="Priority", unique=True)
    tool_type = models.CharField(verbose_name="Tool Type", max_length=20, default="Draw")
    created_at = models.DateTimeField(verbose_name="Created At", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Updated At", auto_now=True)
    item_id = models.CharField(max_length=200,null=True)
    class Meta:
        abstract = True  # Ensure this model is abstract and won't create a separate table

class DrawModel(ToolModel):
    coordinates = models.TextField(verbose_name="Coordinates")
    
    def __str__(self):
        return f"Draw Tool - {self.tool_type}"

class TextModel(ToolModel):
    content = models.CharField(verbose_name="Content", max_length=500)
    color = models.CharField(verbose_name="Text Color", max_length=20)
    coord_in_canvas_X = models.FloatField(verbose_name="Canvas X Coordinate")
    coord_in_canvas_Y = models.FloatField(verbose_name="Canvas Y Coordinate")
    coord_in_doc_X = models.FloatField(verbose_name="Document X Coordinate")
    coord_in_doc_Y = models.FloatField(verbose_name="Document Y Coordinate")
    font_size = models.FloatField(verbose_name="Font Size", default=12)
    bold = models.BooleanField(verbose_name="Bold", default=False)
    italic = models.BooleanField(verbose_name="Italic", default=False)

    def __str__(self):
        return f"Text Tool - {self.content}"
