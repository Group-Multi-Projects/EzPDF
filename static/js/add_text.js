var list_textbox = [];
var isDragging = false;
var listObjectTextBoxInfo = [];
var coord_in_canvas_X, coord_in_canvas_Y, lastTextContent, coord_in_doc_X, coord_in_doc_Y;
const PAGE_HEIGHT = 800;  

var objectTextBoxInfo = {
    file_id: file_id,
    item_id:0,
    type: "addtext",
    coord_in_doc_X: "",
    coord_in_doc_Y: "",
    coord_in_canvas_X: "",
    coord_in_canvas_Y: "",
    content: "",
    fontSize: "",
    color: "black",
    bold: false,
    italic: false,
    page: ""
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
    $("#add_text").click(function () {
        isDrawActive = false;
        isAddTextActive = true;
        isAddImageActive = false;

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
        let uniqueId = 'textBox-' + Date.now();

        let textBox = $('<div class="textBox" contenteditable="true">Enter text here</div>');
        textBox.attr('id', uniqueId); 
        objectTextBoxInfo.item_id = uniqueId   
        let rect = canvas.getBoundingClientRect();
        let coord_in_canvas_X = documentX - canvasLeft;
        let coord_in_canvas_Y = documentY - canvasTop;
        let coord_in_doc_X = 0;
        let coord_in_doc_Y = 0;
        let page = Math.floor(documentY / PAGE_HEIGHT) + 1;

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
            coord_in_doc_X: documentX,
            coord_in_doc_Y: documentY,
            coord_in_canvas_X: coord_in_canvas_X,
            coord_in_canvas_Y: coord_in_canvas_Y,
            content: textBox.text(),
            fontSize: $('#fontSize').val() + 'px',
            page: page
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

                    objectInfo.coord_in_canvas_X = coord_in_canvas_X;
                    objectInfo.coord_in_canvas_Y = coord_in_canvas_Y;
                    objectInfo.coord_in_doc_X = coord_in_doc_X;
                    objectInfo.page = Math.floor(coord_in_doc_Y / PAGE_HEIGHT) + 1;
                }
            });
            $(document).on('mouseup', function () {
                isDragging = false;
                isAddTextActive = false;
                $(document).off('mousemove mouseup');
            });
        });

        // Lắng nghe các thay đổi khác và cập nhật objectInfo
        $('#fontSize, #fontColor').on('change', function () {
            objectInfo.fontSize = $('#fontSize').val() + 'px';
            objectInfo.color = $('#fontColor').val();
        });

        listObjectTextBoxInfo.push(objectInfo);
    }
}
//hàm render texbox cũ
function redrawTextBoxes(arrayObj) {
    arrayObj.forEach(info => {
            console.log("Drawing text box at:", info.coord_in_doc_X, info.coord_in_doc_Y); // Thêm log để kiểm tra tọa độ
            let textBox = $('<div class="textBox" contenteditable="true"></div>');
            textBox.attr('id', info.item_id); 

            textBox.css({
                position: 'absolute',
                display: 'block',
                left: info.coord_in_doc_X + 'px',
                top: info.coord_in_doc_Y + 'px',
                fontSize: info.fontSize,
                color: info.color,
            });
            textBox.text(info.content);
            console.log()
            $("#pdfContainer").append(textBox);
    });
    //xử lý textbox đã tồn tại
    $(".textBox").on('mousedown', function (tb) {
        isDragging = true;
        var $textBox = $(tb.target);
        var textBoxId = ($textBox.attr('id'))
        var coord_canvas_to_doc_X = 0
        var coord_canvas_to_doc_Y = 0
        arrayObj.forEach(obj => {
            if (obj.item_id === textBoxId) {
                var $element = $(`#pdfContainer #${obj.page}`);

                coord_canvas_to_doc_X = $element.get(0).offsetLeft;

                coord_canvas_to_doc_Y = $element.get(0).offsetTop;
                // console.log("Toa do cua canvas so voi doc:",coord_canvas_to_doc_X,coord_canvas_to_doc_Y)
            }
        });
        delta_mouse_to_textbox_X = tb.clientX - $textBox.position().left;
        delta_mouse_to_textbox_Y = tb.clientY - $textBox.position().top;
        objectTextBoxInfo.content = $textBox.text()
        arrayObj.forEach(objInfo => {
            if (objInfo.item_id === textBoxId) {
         
                objInfo.content = $textBox.text()
                console.log("Da sua")
            }
        });
        $textBox.on('input', function () {
            arrayObj.forEach(objInfo => {
                if (objInfo.item_id === textBoxId) {
                    objInfo.content = $(this).text()
                    console.log("Da sua")
                }
            });
        });
        $(document).on('mousemove', function (e) {
            if (isDragging) {
                $textBox.css({
                    left: e.clientX - delta_mouse_to_textbox_X + 'px',
                    top: e.clientY - delta_mouse_to_textbox_Y + 'px'
                });
                coord_in_canvas_X = $textBox.position().left - coord_canvas_to_doc_X
                coord_in_canvas_Y = $textBox.position().top - coord_canvas_to_doc_Y
                coord_in_doc_X = $textBox.position().left
                coord_in_doc_Y =  $textBox.position().top
           
                console.log("Toa do cua textbox so voi canvas:",coord_in_canvas_X,coord_in_canvas_Y)
                arrayObj.forEach(objInfo => {
                    if (objInfo.item_id === textBoxId) {
                        objInfo.coord_in_canvas_X = coord_in_canvas_X
                        objInfo.coord_in_canvas_Y = coord_in_canvas_Y
                        objInfo.coord_in_doc_X = $textBox.position().left
                        objInfo.coord_in_doc_Y = $textBox.position().top
                        objInfo.content = $textBox.text()
                        console.log("Da sua")
                    }
                });
            }
        });
        console.log(listObjectTextBoxInfo)
        $(document).on('mouseup', function () {
            isDragging = false;
            $(document).off('mousemove mouseup');
        });
    });
}
//lấy dữ liệu các textbox đã lưu
$(document).ready(function () {
    var tools_api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3NjkzNDU3LCJpYXQiOjE3MjI1MDk0NTcsImp0aSI6Ijk3MDg3ZGQ0ZWFiMzQ1NGRiOGMwZGRhMDYzYzQ4MWRmIiwidXNlcl9pZCI6Mn0._hZZoyZpB6RdTnubLUd0u0ZrZ44KJXVWqHY2npVooYk";
    $.ajax({
        type: "GET",
        url: `http://127.0.0.1:8000/tools/text_added_api/${file_id}/`,
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + tools_api_token
        },
        success: function (response) {
            listObjectTextBoxInfo = response;
            console.log("Text added api Received response:", response); 
            redrawTextBoxes(listObjectTextBoxInfo);
        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.error('Lỗi trong yêu cầu AJAX cho PDF:', textStatus, errorThrown);
        }
    });
});
