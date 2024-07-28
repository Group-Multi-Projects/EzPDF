import fitz  # PyMuPDF

def add_text_to_pdf(input_pdf, output_pdf, text, position, font_size):
    # Mở file PDF
    doc = fitz.open(input_pdf)

    # Chọn trang đầu tiên
    page = doc[0]

    # Tạo định dạng văn bản
    text_rect = fitz.Rect(position[0], position[1], position[0] + 100, position[1] + 50)  # Dummy rect
    # font_color_rgb = fitz.utils.getColor(font_color)  # Chuyển đổi mã hex màu thành RGB

    # Thêm văn bản vào trang
    page.insert_textbox(text_rect, text, fontsize=font_size, fontname="helv")

    # Lưu file PDF mới
    doc.save(output_pdf)

# Thông tin về văn bản cần thêm //129 x:52 y:24
text = "Hello"
position = (360, 45.8)  # X, Y position
font_size = 12
# font_color = "#000000"  # Mã màu font

# Đường dẫn file PDF đầu vào và đầu ra
input_pdf = "C:/Users/MSI/OneDrive/Tài liệu/Nguyễn Đình Thái-CV.pdf"
output_pdf = "output.pdf"

# Gọi hàm để thêm văn bản
add_text_to_pdf(input_pdf, output_pdf, text, position, font_size)
