from File.models import FileModel
import fitz

class EditModel:
    def __init__(self, file_path):
        self.doc = fitz.open(file_path)

    def text_editing(self, page_num, content, color, coord_in_canvas_X, coord_in_canvas_Y, font_size, font_family, bold, italic):
        # Lấy trang tương ứng
        page = self.doc[page_num]

        # Xác định font style
        font_style = ""
        if bold:
            font_style += "bold"
        if italic:
            font_style += "italic"

        if font_style == "":
            font_style = "regular"

        font = f"{font_family}-{font_style}"
        
        # Chuyển đổi màu từ format tuple hoặc hex sang RGB
        rgb_color = fitz.utils.getColor(color)  # Bạn cần sử dụng tuple RGB hoặc mã hex hợp lệ

        position = fitz.Point(coord_in_canvas_X, coord_in_canvas_Y)

        # Chèn text vào PDF
        page.insert_text(
            position,
            content,
            fontname=font,
            fontsize=font_size,
            color=rgb_color
        )

    def image_editing(self, page_num, image_path, coord_in_canvas_X, coord_in_canvas_Y, height, width, angle):
        # Lấy trang tương ứng
        page = self.doc[page_num]
        
        # Mở file ảnh
        image = open(image_path, "rb").read()

        rect = fitz.Rect(coord_in_canvas_X, coord_in_canvas_Y, coord_in_canvas_X + width, coord_in_canvas_Y + height)

        # Chèn ảnh vào trang PDF
        page.insert_image(rect, stream=image, rotate=angle)

    def shape_editing(self, page_num, coord_in_canvas_X, coord_in_canvas_Y, size, height, width, shape_type):
        # Lấy trang tương ứng
        page = self.doc[page_num]

        if shape_type == "rectangle":
            rect = fitz.Rect(coord_in_canvas_X, coord_in_canvas_Y, coord_in_canvas_X + width, coord_in_canvas_Y + height)
            page.draw_rect(rect, color=(0, 0, 0), width=1)

        elif shape_type == "square":
            size = min(size, width, height)
            rect = fitz.Rect(coord_in_canvas_X, coord_in_canvas_Y, coord_in_canvas_X + size, coord_in_canvas_Y + size)
            page.draw_rect(rect, color=(0, 0, 0), width=1)

        elif shape_type == "circle":
            radius = min(size / 2, width / 2, height / 2)
            center = fitz.Point(coord_in_canvas_X + radius, coord_in_canvas_Y + radius)
            page.draw_circle(center, radius, color=(0, 0, 0), width=1)

        elif shape_type == "triangle":
            p1 = fitz.Point(coord_in_canvas_X, coord_in_canvas_Y + height)
            p2 = fitz.Point(coord_in_canvas_X + width, coord_in_canvas_Y + height)
            p3 = fitz.Point(coord_in_canvas_X + width / 2, coord_in_canvas_Y)
            page.draw_polygon([p1, p2, p3], color=(0, 0, 0), width=1)

    def save(self, output_path):
        # Lưu file PDF đã chỉnh sửa
        self.doc.save(output_path)
