from django.db import models
from File.models import FileModel

class ToolModel(models.Model):
    file = models.ForeignKey(FileModel, on_delete=models.PROTECT, verbose_name="File")
    page = models.IntegerField(verbose_name="Page Number")
    created_at = models.DateTimeField(verbose_name="Created At", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Updated At", auto_now=True)
    item_id = models.CharField(max_length=200, null=True)
    priority = models.IntegerField(verbose_name="Priority", null=True)

    class Meta:
        abstract = True  # Đảm bảo rằng model này là abstract và sẽ không tạo bảng riêng


class DrawModel(ToolModel):
    path_coordinates = models.JSONField(verbose_name="Coordinates", null=True)
    tool_type = models.CharField(verbose_name="Tool Type", max_length=20, default="draw", null=True)
    coord_in_canvas_X = models.FloatField(verbose_name="Canvas X Coordinate",null=True)
    coord_in_canvas_Y = models.FloatField(verbose_name="Canvas Y Coordinate",null=True)
    width = models.FloatField(verbose_name="Line width",null=True)
    color = models.CharField(verbose_name="Line Color", max_length=20,null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['file', 'priority'], name='unique_draw_priority')
        ]

    def __str__(self):
        return f"Draw Tool - {self.tool_type}"
    

class TextModel(ToolModel):
    content = models.CharField(verbose_name="Content", max_length=500)
    color = models.CharField(verbose_name="Text Color", max_length=20)
    coord_in_canvas_X = models.FloatField(verbose_name="Canvas X Coordinate")
    coord_in_canvas_Y = models.FloatField(verbose_name="Canvas Y Coordinate")
    font_size = models.CharField(verbose_name="Font Size", max_length=20, null=True)
    bold = models.BooleanField(verbose_name="Bold", default=False)
    italic = models.BooleanField(verbose_name="Italic", default=False)
    font_family = models.CharField(verbose_name="Font Text", null=True, max_length=100)
    tool_type = models.CharField(verbose_name="Tool Type", max_length=20, default="text", null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['file', 'priority'], name='unique_text_priority')
        ]

    def __str__(self):
        return f"Text Tool - {self.content}"


class ImageModel(ToolModel):
    image = models.ImageField(upload_to="images/images_added/")
    coord_in_canvas_X = models.FloatField(verbose_name="Canvas X Coordinate")
    coord_in_canvas_Y = models.FloatField(verbose_name="Canvas Y Coordinate")
    height = models.FloatField(verbose_name="Image height")
    width = models.FloatField(verbose_name="Image width")
    tool_type = models.CharField(verbose_name="Tool Type", default="image", max_length=20, null=True)
    angle = models.FloatField(verbose_name="Angle",null=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['file', 'priority'], name='unique_image_priority')
        ]


class ShapeModel(ToolModel):
    coord_in_canvas_X = models.FloatField(verbose_name="Canvas X Coordinate")
    coord_in_canvas_Y = models.FloatField(verbose_name="Canvas Y Coordinate")
    height = models.FloatField(verbose_name="Shape height")
    width = models.FloatField(verbose_name="Shape width")
    color = models.CharField(max_length=20)
    radius = models.CharField(verbose_name="Radius", max_length=20, null=True,default=0)
    shape_type = models.CharField(verbose_name="Type of shape", max_length=50, null=True)
    tool_type = models.CharField(verbose_name="Tool Type", default="shape", max_length=20, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['file', 'priority'], name='unique_shape_priority')
        ]
