import fitz  # PyMuPDF
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io
import tempfile
import os
from PIL import Image, ImageOps

# Các tọa độ được cung cấp
coordinates = [
    {"x": 116, "y": 72.59999084472656}, {"x": 121, "y": 74.59999084472656}, 
    {"x": 128, "y": 77.59999084472656}, {"x": 136, "y": 80.59999084472656}, 
    {"x": 145, "y": 84.59999084472656}, {"x": 152, "y": 88.59999084472656}, 
    {"x": 160, "y": 94.59999084472656}, {"x": 164, "y": 96.59999084472656}, 
]
path_pdf = "C:/Users/MSI/OneDrive/Tài liệu/NguyenDinhThai22014513.pdf"

# Tạo một PDF mới với ReportLab để vẽ đường
packet = io.BytesIO()
can = canvas.Canvas(packet, pagesize=letter)

# Tạo đường vẽ
path = can.beginPath()
path.moveTo(coordinates[0]["x"], 792 - coordinates[0]["y"])  # Trục y của PDF bắt đầu từ dưới cùng

# Vẽ đường
for coord in coordinates[1:]:
    path.lineTo(coord["x"], 792 - coord["y"])

# Vẽ đường lên canvas
can.drawPath(path, stroke=1, fill=0)
can.save()

# Di chuyển nội dung của PDF mới (đường vẽ) vào PDF hiện có
packet.seek(0)
new_pdf = fitz.open(stream=packet, filetype="pdf")  # Tạo tệp PDF tạm thời để chứa đường vẽ
existing_pdf = fitz.open(path_pdf)  # Thay thế bằng đường dẫn tới tệp PDF hiện có

# Lấy trang đầu tiên của PDF hiện có và trang mới
page = existing_pdf[0]
new_page = new_pdf[0]

# Chuyển đổi trang mới thành hình ảnh
pix = new_page.get_pixmap()

# Tạo một tệp tạm thời để lưu hình ảnh mà không tự động xóa
temp_image_path = os.path.join(tempfile.gettempdir(), "temp_image.png")
pix.save(temp_image_path)

# Xử lý hình ảnh để xóa phông nền
with Image.open(temp_image_path) as img:
    # Chuyển đổi ảnh sang chế độ RGBA để đảm bảo có kênh alpha (độ trong suốt)
    img = img.convert("RGBA")

    # Lấy dữ liệu của ảnh
    datas = img.getdata()

    new_data = []
    for item in datas:
        # Thay đổi màu trắng (hoặc bất kỳ màu nào bạn muốn xóa) thành trong suốt
        if item[:3] == (255, 255, 255):  # Phông nền trắng
            new_data.append((255, 255, 255, 0))  # Thay bằng màu trong suốt
        else:
            new_data.append(item)

    # Cập nhật dữ liệu ảnh
    img.putdata(new_data)

    # Lưu lại hình ảnh đã xử lý
    img.save(temp_image_path, "PNG")

# Chèn hình ảnh vào trang hiện có
page.insert_image(page.rect, filename=temp_image_path)

# Lưu PDF đã chỉnh sửa vào một tệp mới
existing_pdf.save("output_file.pdf")

# Xóa tệp tạm thời sau khi sử dụng
os.remove(temp_image_path)
