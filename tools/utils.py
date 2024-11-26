from django.conf import settings
import os
import fitz
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def create_pdf_if_not_exists():
    output_file = os.path.join(settings.MEDIA_ROOT, 'files', 'converted_files', 'output.pdf')
    
    # Kiểm tra xem file đã tồn tại chưa
    if not os.path.exists(output_file):
        # Nếu không tồn tại, tạo một file PDF mới
        c = canvas.Canvas(output_file, pagesize=letter)
        c.drawString(100, 750, "This is a new PDF file.")
        c.drawString(100, 735, "Output file has been created because it did not exist.")
        c.showPage()  # Kết thúc trang
        c.save()  # Lưu file PDF
        print(f"Created new PDF file: {output_file}")
    else:
        print(f"PDF file already exists: {output_file}")


def text_editing(doc,text_data):
    # Gọi hàm
    # create_pdf_if_not_exists()
    output_file = os.path.join(settings.MEDIA_ROOT,'files', 'converted_files', 'output.pdf')
    print("Page:",text_data['page'])

    page_number = int(text_data['page']) - 1 
    page = doc[page_number]  
    text = text_data['content']
    position = fitz.Point(float(text_data['coord_in_canvas_X']), float(text_data['coord_in_canvas_Y'])) 
    font_size = float(text_data.get('font_size'))

    page.insert_text(position, text, fontsize=font_size, fontname="helv", color=(0, 0, 0))

    output_pdf_path = output_file
    doc.save(output_pdf_path)
    

def image_editing(doc, image_data,image_path):
 
    output_file = os.path.join(settings.MEDIA_ROOT,'files', 'converted_files', 'output.pdf')
    print("Page:",image_data['page'])

    page_number = int(image_data['page']) - 1 # Chuyển đổi giá trị trang từ chuỗi sang số nguyên
    page = doc[page_number]  # Truy cập trang bằng số nguyên
    x0,y0 = float(image_data['coord_in_canvas_X']),float(image_data['coord_in_canvas_Y'])
    x1, y1 = x0 + float(image_data['width']), y0 + float(image_data['height'])
    rect = fitz.Rect(x0, y0, x1, y1)
    page.insert_image(rect, filename=image_path)
    output_pdf_path = output_file
    doc.save(output_pdf_path)
    
def normalize_color(color):
    # Normalize the color to a tuple of (R, G, B) values 0-255 range to 0-1 range
    return tuple(c / 255.0 for c in color)
def shape_editing(doc, shape_data):
    output_file = os.path.join(settings.MEDIA_ROOT,'files', 'converted_files', 'output.pdf')

    page_number = int(shape_data['page']) - 1
    page = doc[page_number]
    color = (0, 0, 0) if 'color' not in shape_data else normalize_color(tuple(int(shape_data['color'][i:i + 2], 16) for i in (1, 3, 5)))

    if shape_data['shape_type'] == 'rectangle':
        rect = fitz.Rect(shape_data['coord_in_canvas_X'], shape_data['coord_in_canvas_Y'], shape_data['coord_in_canvas_X'] + shape_data['width'], shape_data['coord_in_canvas_Y'] + shape_data['height'])
        page.draw_rect(rect, color=color, fill=color)
    elif shape_data['shape_type'] == 'square':
        rect = fitz.Rect(shape_data['coord_in_canvas_X'], shape_data['coord_in_canvas_Y'], shape_data['coord_in_canvas_X'] + shape_data['width'], shape_data['coord_in_canvas_Y'] + shape_data['height'])
        page.draw_rect(rect, color=color, fill=color)
    elif shape_data['shape_type'] == 'circle':
        center = fitz.Point(shape_data['coord_in_canvas_X']+shape_data['radius'], shape_data['coord_in_canvas_Y']+shape_data['radius'])
        page.draw_circle(center, shape_data['radius'], color=color, fill=color)

    # elif shape_data['shape_type'] == 'line':
    #     page.draw_line((shape_data['x1'], shape_data['y1']), (shape_data['x2'], shape_data['y2']), color=color, width=shape_data['strokeWidth'])
    doc.save(output_file)