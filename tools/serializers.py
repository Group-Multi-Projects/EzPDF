from rest_framework import serializers
from .models import DrawModel,TextModel,ToolModel
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