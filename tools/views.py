from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import DrawModel, TextModel, ToolModel
from File.models import FileModel
import json
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from rest_framework.response import Response
from .serializers import DrawSerializers,TextSerializers,ToolsSerializers
from rest_framework.permissions import IsAuthenticated
@csrf_exempt
def get_obj_all_changes_event(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(type(data))
            print(data)
            file_id = int(data.get('file_id'))
            file_instance = FileModel.objects.get(id=file_id)

            # Lưu dữ liệu vẽ
            draw_data = data.get('draw', [])
            for draw in draw_data:
                draw_id = draw.get("draw_id")
                DrawModel.objects.update_or_create(
                    file=file_instance,
                    item_id = draw_id,
                    page=draw['page'],
                    tool_type=draw.get('tool_type', 'Draw'),
                    defaults={
                        'coordinates': json.dumps(draw['coordinates']),
                        'updated_at': timezone.now()  # Cập nhật thời gian chỉnh sửa
                    }
                )

            # Lưu dữ liệu văn bản
            text_data = data.get('addtext', [])
            for text in text_data:
                item_id = text.get('item_id')

                TextModel.objects.update_or_create(
                    
                    file=file_instance,
                    item_id = item_id,
                    page=text['page'],
                    tool_type=text.get('tool_type', 'Text'),
                    defaults={
                        'content': text['content'],
                        'color': text['color'],
                        'coord_in_canvas_X': float(text['coord_in_canvas_X']),
                        'coord_in_canvas_Y': float(text['coord_in_canvas_Y']),
                        'coord_in_doc_X': float(text['coord_in_doc_X']),
                        'coord_in_doc_Y': float(text['coord_in_doc_Y']),
                        'font_size': text.get('fontsize', 12),
                        'bold': text.get('bold', False),
                        'italic': text.get('italic', False),
                        'updated_at': timezone.now()  # Cập nhật thời gian chỉnh sửa
                    }
                )

            return JsonResponse({'status': 'success', 'message': 'Data saved successfully!'})

        except FileModel.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'File not found.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})

def draw(request):
    pass
def add_text(request):
    pass

@api_view(["GET","POST"])
def get_post_tools_api(request):
    draw_model = DrawModel.objects.all()
    text_model = TextModel.objects.all()
    if request.method == "GET":
        draw_serializers = DrawSerializers(draw_model,many = True)
        text_serializers = TextSerializers(text_model,many = True)
        serializers_data = draw_serializers.data + text_serializers.data
        return Response(serializers_data)
    
    if request.method == "POST":
        draw_serializer = DrawSerializers(data=request.data)
        text_serializer = TextSerializers(data=request.data)
        if DrawSerializers.is_valid():
            DrawSerializers.save()
            return  Response({"Success":"Success"})
        if TextSerializers.is_valid():
            TextSerializers.save()
            return  Response({"Success":"Success"})

@api_view(["GET","PUT","DELETE"])
def get_put_delete_tools_api(request,id):
    file = FileModel.objects.get(id = id)
    # draw_model = DrawModel.objects.filter(
    #     file = file
    # )
    text_model = TextModel.objects.filter(
        file = file
    )
    if request.method == "GET":
        # draw_serializers = DrawSerializers(draw_model,many = True)
        text_serializers = TextSerializers(text_model,many = True)
        # serializers_data = draw_serializers.data + text_serializers.data
        return Response(text_serializers.data)
    
   