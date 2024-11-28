from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import DrawModel, TextModel, ImageModel, ShapeModel
from File.models import FileModel
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from .serializers import DrawSerializers, TextSerializers, ImageSerializers, ShapeSerializers
from rest_framework.permissions import IsAuthenticated
from django.core.files.base import ContentFile
import base64
import fitz 
import os
from django.conf import settings
from .utils import text_editing, image_editing, shape_editing
# Dictionary to map font names to file paths
FONT_FILES = {
    'Arial': os.path.join(settings.MEDIA_URL, 'fonts', 'Arial.ttf'),
    'Times New Roman': os.path.join(settings.MEDIA_URL, 'fonts', 'TimesNewRoman.ttf'),
    'Courier New': os.path.join(settings.MEDIA_URL, 'fonts', 'CourierNew.ttf'),
    'Verdana': os.path.join(settings.MEDIA_URL, 'fonts', 'Verdana.ttf'),
    'Tahoma': os.path.join(settings.MEDIA_URL, 'fonts', 'Tahoma.ttf')
}
@csrf_exempt
def get_obj_all_changes_event(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            file_id = int(data.get('file_id'))
            file_instance = FileModel.objects.get(id=file_id)
            file_path = str(file_instance.get_file_path())
            file_path = os.path.join(settings.MEDIA_ROOT,file_path)
            doc = fitz.open(file_path)
            # Lưu dữ liệu vẽ
            draw_save_data(data, file_instance,doc)
            # Lưu dữ liệu văn bản
            add_text_save_data(data, file_instance,doc)
            # Lưu dữ liệu hình ảnh
            add_image_save_data(data, file_instance,doc)
            # Lưu dữ liệu hình dạng
            add_shape_save_data(data, file_instance,doc)

            return JsonResponse({'status': 'success', 'message': 'Data saved successfully!'})
        except FileModel.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'File not found.'})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'})
        # except Exception as e:
        #     return JsonResponse({'status': 'error', 'message': f'Error: {str(e)}'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})

def draw_save_data(data, file_instance,doc):
    draw_data = data.get('draw', [])
    for draw in draw_data:
        item_id = draw.get("item_id")
        DrawModel.objects.update_or_create(
            file=file_instance,
            item_id=item_id,
            page=draw.get('page', None),
            defaults={
                'path_coordinates': draw.get('path_coordinates', []),
                'coord_in_canvas_X': float(draw['coord_in_canvas_X']),
                'coord_in_canvas_Y': float(draw['coord_in_canvas_Y']),   
                'width': float(draw['width']),
                'color': draw['color'],
                
                'updated_at': timezone.now()
            }
        )
        



def add_text_save_data(data,file_instance,doc):
    text_data = data.get('addtext', [])
    for text in text_data:
        text_editing(doc,text)
        item_id = text.get('item_id')
        # font_size = text['font_size']
        # font_family = text['font_family']
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
                'font_size': text.get('font_size'),
                'font_family': text.get('font_family'),
                'bold': text.get('bold'),
                'italic': text.get('italic'),
                # 'priority':int(text.get('priority')),
                'updated_at': timezone.now()  # Cập nhật thời gian chỉnh sửa
            }
        )



def add_image_save_data(data, file_instance, doc):
    image_data = data.get('addimage', [])
    for image in image_data:
        item_id = image.get('item_id')
        try:
            # Split the base64 data into header and content
            format, imgstr = image['image'].split(';base64,')
            ext = format.split('/')[-1]  # Get the extension
            
            # Decode the image data
            image_converted = ContentFile(base64.b64decode(imgstr), name=f"{item_id}.{ext}")
            
            # Define the path where the image will be saved
            image_path = os.path.join(settings.MEDIA_ROOT, 'images', f"{item_id}.{ext}")
            
            # Save the image to the specified path
            with open(image_path, 'wb') as img_file:
                img_file.write(image_converted.read())

        except Exception as e:
            print(f"Error processing image for item_id {item_id}: {e}")
            continue  # Skip this iteration if there's an error

        # Perform any additional image editing
        image_editing(doc, image, image_path)

        # Update or create the image record in the database
        ImageModel.objects.update_or_create(
            file=file_instance,
            item_id=item_id,
            page=image['page'],
            defaults={
                'image': f"images/{item_id}.{ext}",  # Save relative path for the ImageModel
                'coord_in_canvas_X': float(image['coord_in_canvas_X']),
                'coord_in_canvas_Y': float(image['coord_in_canvas_Y']),
                'height': float(image['height']),
                'width': float(image['width']),
                'angle': float(image['angle']),
                'updated_at': timezone.now()  # Update the timestamp
            }
        )




def add_shape_save_data(data, file_instance,doc):
    shapes_data = data.get("addshape",[])
    for shape in shapes_data:
        item_id = shape.get('item_id')
        shape_editing(doc, shape)
        ShapeModel.objects.update_or_create(
            file=file_instance,
            item_id=item_id,
            page=shape['page'],
            # tool_type = shape['type'],
            defaults={
                'coord_in_canvas_X': float(shape['coord_in_canvas_X']),
                'coord_in_canvas_Y': float(shape['coord_in_canvas_Y']),

                'height': float(shape['height']),
                'width': float(shape['width']),
                'radius':shape['radius'],
                'shape_type': (shape['shape_type']),
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
        
@api_view(["GET", "DELETE"])
def get_delete_tools_api(request, item_id):
    try:
        type = item_id.split("-")[0]
        print(type)
        if type == "textBox":
            text_model = TextModel.objects.get(item_id=item_id)
            if request.method == "GET":
                text_serializer = TextSerializers(text_model)
                return Response(text_serializer.data, status=status.HTTP_200_OK)
            elif request.method == "DELETE":
                text_model.delete()
                return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

        elif type == "image":
            image_model = ImageModel.objects.get(item_id=item_id)
            if request.method == "GET":
                image_serializer = ImageSerializers(image_model)
                return Response(image_serializer.data, status=status.HTTP_200_OK)
            elif request.method == "DELETE":
                image_model.delete()
                return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        elif type == "draw":
            image_model = DrawModel.objects.get(item_id=item_id)
            if request.method == "GET":
                image_serializer = DrawSerializers(image_model)
                return Response(image_serializer.data, status=status.HTTP_200_OK)
            elif request.method == "DELETE":
                image_model.delete()
                return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

        elif type == "shape":
            shape_model = ShapeModel.objects.get(item_id=item_id)
            if request.method == "GET":
                shape_serializer = ShapeSerializers(shape_model)
                return Response(shape_serializer.data, status=status.HTTP_200_OK)
            elif request.method == "DELETE":
                shape_model.delete()
                return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Invalid item type"}, status=status.HTTP_400_BAD_REQUEST)

    except TextModel.DoesNotExist:
        return Response({"error": "Text item not found"}, status=status.HTTP_404_NOT_FOUND)
    except ImageModel.DoesNotExist:
        return Response({"error": "Image item not found"}, status=status.HTTP_404_NOT_FOUND)
    except ShapeModel.DoesNotExist:
        return Response({"error": "Shape item not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["GET"])
def get_draw_added_api(request,id):
    file = FileModel.objects.get(id = id)
    draw_model = DrawModel.objects.filter(
        file = file
    )
    if request.method == "GET":
        draw_serializers = DrawSerializers(draw_model,many = True)
        return Response(draw_serializers.data)
    
   
@api_view(["GET"])
def get_text_added_api(request,id):
    file = FileModel.objects.get(id = id)
    text_model = TextModel.objects.filter(
        file = file
    )
    if request.method == "GET":
        text_serializers = TextSerializers(text_model,many = True)
        return Response(text_serializers.data)
    
@api_view(["GET"])
def get_image_added_api(request,id):
    file = FileModel.objects.get(id = id)
    text_model = ImageModel.objects.filter(
        file = file
    )
    if request.method == "GET":
        image_serializers = ImageSerializers(text_model,many = True)
        return Response(image_serializers.data)
    
@api_view(["GET"])
def get_shape_added_api(request,id):
    file = FileModel.objects.get(id = id)
    shape_model = ShapeModel.objects.filter(
        file = file
    )
    if request.method == "GET":
        shape_serializers = ShapeSerializers(shape_model,many = True)
        return Response(shape_serializers.data)
from .tasks import test_func
from django.http import HttpResponse

def test_celery(request):
    test_func.delay()
    return HttpResponse("Success")
