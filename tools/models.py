from django.db import models
from File.models import FileModel

# Create your models here.
class ToolModel(models.Model):
    file = models.ForeignKey(FileModel, on_delete=models.PROTECT, verbose_name="File")
    page = models.IntegerField(verbose_name="Page Number")
    tool_type = models.CharField(verbose_name="Tool Type", max_length=20,null=True)
    created_at = models.DateTimeField(verbose_name="Created At", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Updated At", auto_now=True)
    item_id = models.CharField(max_length=200,null=True)
    class Meta:
        abstract = True  # Ensure this model is abstract and won't create a separate table


class DrawModel(ToolModel):
    coordinates = models.JSONField(verbose_name="Coordinates",null=True)  # Sử dụng JSONField

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

class ImageModel(ToolModel):
    image = models.ImageField(upload_to="images/images_added/")
    coord_in_canvas_X = models.FloatField(verbose_name="Canvas X Coordinate")
    coord_in_canvas_Y = models.FloatField(verbose_name="Canvas Y Coordinate")
    coord_in_doc_X = models.FloatField(verbose_name="Document X Coordinate")
    coord_in_doc_Y = models.FloatField(verbose_name="Document Y Coordinate")
    height = models.FloatField(verbose_name="Image height")
    width = models.FloatField(verbose_name="Image width")
    canvas_id = models.IntegerField(verbose_name="Image in st.canvas:",null=True)
    
class ShapeModel(ToolModel):
    coord_in_canvas_X = models.FloatField(verbose_name="Canvas X Coordinate")
    coord_in_canvas_Y = models.FloatField(verbose_name="Canvas Y Coordinate")
    coord_in_doc_X = models.FloatField(verbose_name="Document X Coordinate")
    coord_in_doc_Y = models.FloatField(verbose_name="Document Y Coordinate")
    height = models.FloatField(verbose_name="Geometry height")
    width = models.FloatField(verbose_name="Geometry width")
    color = models.CharField(max_length=20)
    borderRadius = models.CharField(verbose_name="Radius",max_length=20,null=True)
    canvas_id = models.IntegerField(verbose_name="Shape in st.canvas:",null=True)
    shapeType = models.CharField(verbose_name="Type of shape",max_length=50,null=True)
    