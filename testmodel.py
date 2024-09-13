import fitz  # PyMuPDF

# Mở file PDF
pdf_document = fitz.open('input.pdf')

# Mở trang mà bạn muốn thêm ảnh vào
page = pdf_document[0]  # Ví dụ: trang đầu tiên

# Đường dẫn đến ảnh bạn muốn thêm
image_path = 'example.jpg'

# Tọa độ góc trên bên trái và kích thước của ảnh
x0, y0 = 100, 100  # Tọa độ góc trên bên trái
width, height = 200, 200  # Chiều rộng và chiều cao của ảnh

# Tính toán tọa độ góc dưới bên phải
x1, y1 = x0 + width, y0 + height

# Tạo hình chữ nhật với tọa độ và kích thước
rect = fitz.Rect(x0, y0, x1, y1)

# Thêm ảnh vào trang
page.insert_image(rect, filename=image_path)

# Lưu file PDF đã chỉnh sửa
pdf_document.save('output.pdf')

# Đóng file PDF
pdf_document.close()
