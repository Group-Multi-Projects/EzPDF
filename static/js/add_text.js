var list_textbox = [];
var isDragging = false;
var listObjectTextBoxInfo = [];
var coord_in_canvas_X, coord_in_canvas_Y, lastTextContent, coord_in_doc_X, coord_in_doc_Y;
const PAGE_HEIGHT = 800;  // Giả sử mỗi trang có chiều cao 800px, bạn có thể thay đổi giá trị này nếu cần

var objectTextBoxInfo = {
    file_id:file_id,
    textbox_id:0,
    type: "addtext",
    docX: "",
    docY: "",
    coord_in_canvas_X: "",
    coord_in_canvas_Y: "",
    content: "",
    fontSize: "",
    color: "black",
    bold: false,
    italic: false,
    priority: "",
    page: ""  // Thêm thuộc tính page
};

// Lấy khoảng cách từ cạnh trái của canvas tới left document
function getCanvasOffsetLeft(canvas) {
    var offsetLeft = 0;
    var currentElement = canvas;

    while (currentElement) {
        offsetLeft += currentElement.offsetLeft;
        currentElement = currentElement.offsetParent;
    }
    return offsetLeft;
}

// Lấy khoảng cách từ cạnh trên của canvas tới top document
function getCanvasOffsetTop(canvas) {
    var offsetTop = 0;
    var currentElement = canvas;

    while (currentElement) {
        offsetTop += currentElement.offsetTop;
        currentElement = currentElement.offsetParent;
    }

    return offsetTop;
}

function setupTextAdding(canvas) {
    // Thêm sự kiện click cho nút #readdtext
    $("#readdtext").click(function() {
        redrawTextBoxes(canvas,listObjectTextBoxInfo);
    });

    $("#add_text").click(function () {
        isDrawActive = false;
        isAddTextActive = true;
        $(canvas).on("mousedown", function (e) {
            let documentX = e.pageX;
            let documentY = e.pageY;
            let canvasOffsetTop = getCanvasOffsetTop(this);
            let canvasOffsetLeft = getCanvasOffsetLeft(this);
            addText(this, documentX, documentY, canvasOffsetLeft, canvasOffsetTop);
            isAddTextActive = false;
        });
    });
}

function addText(canvas, documentX, documentY, canvasLeft, canvasTop) {
    if (isAddTextActive) {
        let uniqueId = 'textBox-' + Date.now(); // Ví dụ: 'textBox-1690992901876'

        let textBox = $('<div class="textBox" contenteditable="true">Enter text here</div>');
        textBox.attr('id', uniqueId); 
        objectTextBoxInfo.textbox_id = uniqueId   
        let rect = canvas.getBoundingClientRect();
        let coord_in_canvas_X = documentX - canvasLeft;
        let coord_in_canvas_Y = documentY - canvasTop;
        let coord_in_doc_X = 0;
        let coord_in_doc_Y = 0;
        let page = Math.floor(documentY / PAGE_HEIGHT) + 1;  // Tính toán số trang

        textBox.css({
            position: 'absolute',
            display: 'block',
            left: documentX + 'px',
            top: documentY + 'px',
            fontSize: $('#fontSize').val() + 'px',
            color: $('#fontColor').val(),
        });

        $(canvas).parent().append(textBox);

        let objectInfo = Object.assign({}, objectTextBoxInfo, {
            docX: documentX,
            docY: documentY,
            coord_in_canvas_X: coord_in_canvas_X,
            coord_in_canvas_Y: coord_in_canvas_Y,
            content: textBox.text(),
            fontSize: $('#fontSize').val() + 'px',
            // color: $('#fontColor').val(),
            page: page  // Lưu số trang vào objectInfo
        });

        textBox.on('input', function () {
            objectInfo.content = $(this).text();
        });

        textBox.on('mousedown', function (tb) {
            isDragging = true;
            var $textBox = $(tb.target);
            delta_mouse_to_textbox_X = tb.clientX - $textBox.position().left;
            delta_mouse_to_textbox_Y = tb.clientY - $textBox.position().top;

            coord_in_doc_X = $textBox.position().left;
            coord_in_doc_Y = $textBox.position().top;

            $(document).on('mousemove', function (e) {
                if (isDragging) {
                    textBox.css({
                        left: e.clientX - delta_mouse_to_textbox_X + 'px',
                        top: e.clientY - delta_mouse_to_textbox_Y + 'px'
                    });

                    coord_in_canvas_X = $textBox.position().left - canvasLeft;
                    coord_in_canvas_Y = $textBox.position().top - canvasTop;
                    coord_in_doc_X = $textBox.position().left;
                    coord_in_doc_Y = $textBox.position().top;

                    // Cập nhật thông tin của textBox
                    objectInfo.coord_in_canvas_X = coord_in_canvas_X;
                    objectInfo.coord_in_canvas_Y = coord_in_canvas_Y;
                    objectInfo.docX = coord_in_doc_X;
                    objectInfo.docY = coord_in_doc_Y;
                    objectInfo.page = Math.floor(coord_in_doc_Y / PAGE_HEIGHT) + 1;  // Cập nhật số trang
                }
            });

            $(document).on('mouseup', function () {
                isDragging = false;
                isAddTextActive = false;
                $(document).off('mousemove mouseup');
            });
        });

        listObjectTextBoxInfo.push(objectInfo);
    }
}

function redrawTextBoxes(canvas,arrayObj) {
    // Xóa tất cả các textBox hiện tại trên canvas trước khi vẽ lại
    $(canvas).parent().find('.textBox').remove();
    
    arrayObj.forEach(info => {
        let textBox = $('<div class="textBox" contenteditable="true"></div>');
        textBox.css({
            position: 'absolute',
            display: 'block',
            left: info.docX + 'px',
            top: info.docY + 'px',
            fontSize: info.fontSize,
            color: 'red',  // Đặt màu chữ đỏ
        });
        textBox.text(info.content);
        $(canvas).parent().append(textBox);

        textBox.on('mousedown', function (tb) {
            isDragging = true;
            var $textBox = $(tb.target);
            delta_mouse_to_textbox_X = tb.clientX - $textBox.position().left;
            delta_mouse_to_textbox_Y = tb.clientY - $textBox.position().top;

            $(document).on('mousemove', function (e) {
                if (isDragging) {
                    textBox.css({
                        left: e.clientX - delta_mouse_to_textbox_X + 'px',
                        top: e.clientY - delta_mouse_to_textbox_Y + 'px'
                    });
                }
            });

            $(document).on('mouseup', function () {
                isDragging = false;
                $(document).off('mousemove mouseup');
            });
        });
    });
}

$('#save_add_text').click(function () {
    listObjectTextBoxInfo.forEach(info => {
        console.log("File id:",info.file_id)
        console.log("Tọa độ của textbox so với canvas:", info.coord_in_canvas_X, info.coord_in_canvas_Y);
        console.log("Tọa độ của textbox so với document:", info.docX, info.docY);
        console.log("Nội dung:", info.content);
        console.log("Trang:", info.page);  // In ra số trang của text box
    });
    console.log(listObjectTextBoxInfo)
});

// Sử dụng hàm setupTextAdding để khởi tạo sự kiện click cho các nút
setupTextAdding(document.getElementById('canvas-id'));
