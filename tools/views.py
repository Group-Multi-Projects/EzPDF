from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import DrawModel, TextModel, ToolModel, ImageModel, ShapeModel
from File.models import FileModel
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from .serializers import DrawSerializers, TextSerializers, ToolsSerializers, ImageSerializers, ShapeSerializers
from rest_framework.permissions import IsAuthenticated
from django.core.files.base import ContentFile
import base64

@csrf_exempt
def get_obj_all_changes_event(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            file_id = int(data.get('file_id'))
            file_instance = FileModel.objects.get(id=file_id)

            # Lưu dữ liệu vẽ
            draw_save_data(request,data, file_instance)
            # Lưu dữ liệu văn bản
            add_text_save_data(request,data, file_instance)
            # Lưu dữ liệu hình ảnh
            add_image_save_data(request,data, file_instance)
            # Lưu dữ liệu hình dạng
            add_shape_save_data(request,data, file_instance)

            return JsonResponse({'status': 'success', 'message': 'Data saved successfully!'})
        except FileModel.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'File not found.'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Error: {str(e)}'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})

def draw_save_data(request,data, file_instance):
    draw_data = data.get('draw', [])
    for draw in draw_data:
        item_id = draw.get("item_id")
        DrawModel.objects.update_or_create(
            file=file_instance,
            item_id=item_id,
            page=draw.get('page', None),
            defaults={
                'coordinates': draw.get('coordinates', []),
                'updated_at': timezone.now()  # Cập nhật thời gian chỉnh sửa
            }
        )
def add_text_save_data(request,data,file_instance):
    text_data = data.get('addtext', [])
    for text in text_data:
        item_id = text.get('item_id')

        TextModel.objects.update_or_create(
            file=file_instance,
            item_id = item_id,
            page=text['page'],
            # tool_type = text['type'],
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
def add_image_save_data(request, data, file_instance):
    image_data = data.get('addimage', [])
    for image in image_data:
        item_id = image.get('item_id')
        try:
            format, imgstr = image['image'].split(';base64,')
            ext = format.split('/')[-1]

            image_converted = ContentFile(base64.b64decode(imgstr), name=f"{item_id}.{ext}")
        except:
            image_converted = image.get('image').replace('/media/', '')
        ImageModel.objects.update_or_create(
            file=file_instance,
            item_id=item_id,
            page=image['page'],
            # tool_type=image['type'],
            defaults={
                'image': image_converted,
                'coord_in_canvas_X': float(image['coord_in_canvas_X']),
                'coord_in_canvas_Y': float(image['coord_in_canvas_Y']),
                'coord_in_doc_X': float(image['coord_in_doc_X']),
                'coord_in_doc_Y': float(image['coord_in_doc_Y']),
                'height': float(image['height']),
                'width': float(image['width']),
                'canvas_id': int(image['canvas_id']),
                'updated_at': timezone.now()  # Cập nhật thời gian chỉnh sửa
            }
        )
def add_shape_save_data(request,data, file_instance):
    shapes_data = data.get("addshape",[])
    for shape in shapes_data:
        item_id = shape.get('item_id')
        ShapeModel.objects.update_or_create(
            file=file_instance,
            item_id=item_id,
            page=shape['page'],
            # tool_type = shape['type'],
            defaults={
                'coord_in_canvas_X': float(shape['coord_in_canvas_X']),
                'coord_in_canvas_Y': float(shape['coord_in_canvas_Y']),
                'coord_in_doc_X': float(shape['coord_in_doc_X']),
                'coord_in_doc_Y': float(shape['coord_in_doc_Y']),
                'height': float(shape['height']),
                'width': float(shape['width']),
                'borderRadius':shape['borderRadius'],
                'canvas_id': int(shape['canvas_id']),
                'shapeType': (shape['shapeType']),
                'updated_at': timezone.now()  # Cập nhật thời gian chỉnh sửa
            }
        )
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
        
@api_view(["GET"])
def get_put_delete_draw_added_api(request,id):
    file = FileModel.objects.get(id = id)
    draw_model = DrawModel.objects.filter(
        file = file
    )
    if request.method == "GET":
        draw_serializers = DrawSerializers(draw_model,many = True)
        return Response(draw_serializers.data)
    
   
@api_view(["GET"])
def get_put_delete_text_added_api(request,id):
    file = FileModel.objects.get(id = id)
    text_model = TextModel.objects.filter(
        file = file
    )
    if request.method == "GET":
        text_serializers = TextSerializers(text_model,many = True)
        return Response(text_serializers.data)
    
@api_view(["GET"])
def get_put_delete_image_added_api(request,id):
    file = FileModel.objects.get(id = id)
    text_model = ImageModel.objects.filter(
        file = file
    )
    if request.method == "GET":
        image_serializers = ImageSerializers(text_model,many = True)
        return Response(image_serializers.data)
    
@api_view(["GET"])
def get_put_delete_shape_added_api(request,id):
    file = FileModel.objects.get(id = id)
    shape_model = ShapeModel.objects.filter(
        file = file
    )
    if request.method == "GET":
        shape_serializers = ShapeSerializers(shape_model,many = True)
        return Response(shape_serializers.data)
    
   