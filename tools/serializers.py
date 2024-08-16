from rest_framework import serializers
from .models import DrawModel,TextModel,ToolModel,ImageModel,ShapeModel
class DrawSerializers(serializers.ModelSerializer):
    class Meta():
        model = DrawModel
        fields = "__all__"
        
class TextSerializers(serializers.ModelSerializer):
    class Meta():
        model = TextModel
        fields = "__all__"
        
class ToolsSerializers(serializers.ModelSerializer):
    class Meta():
        model = ToolModel
        fields = "__all__"

class ImageSerializers(serializers.ModelSerializer):
      class Meta():
        model = ImageModel
        fields = "__all__"

class ShapeSerializers(serializers.ModelSerializer):
      class Meta():
        model = ShapeModel
        fields = "__all__"