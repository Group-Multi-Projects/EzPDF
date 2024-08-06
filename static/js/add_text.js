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
    font_size: "",
    font_family:"",
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
        isAddShapesActive = false;

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
        let tools_edit_text = $(
            `<div class="editor-toolbar" id="toolfor${uniqueId}">
                <select id="fonttext">
                    <option>Helvetica</option>
                    <option>Arial</option>
                    <option>Times New Roman</option>
                </select>
                <input type="number" value="11" min="1" step="1" id="_s" style="width: 50px;">
                <button class="icon" id="bold"><b>B</b></button>
                <button class="icon" id="italic"><i>i</i></button>
                <button class="icon" id="textdelete"><img src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png" alt="Delete"></button>
            </div>`
        );
        textBox.attr('id', uniqueId); 
        objectTextBoxInfo.item_id = uniqueId;   
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
        tools_edit_text.css({
            position: 'absolute',
            display: 'none',
            left: documentX + 'px',
            top: documentY - 40 + 'px',
        });
        $("#pdfContainer").append(tools_edit_text);
        $(canvas).parent().append(textBox);
      
        let objectInfo = Object.assign({}, objectTextBoxInfo, {
            coord_in_doc_X: documentX,
            coord_in_doc_Y: documentY,
            coord_in_canvas_X: coord_in_canvas_X,
            coord_in_canvas_Y: coord_in_canvas_Y,
            content: textBox.text(),
            font_size: "12" + 'px',
            page: page,
            font_family:"",
            bold:false,
            italic:false
        });

        textBox.on('input', function () {
            objectInfo.content = $(this).text();
        });
        tools_edit_text.find("#fonttext").on("change", function () {
            textBox.css({
                fontFamily:this.value
            })
            objectInfo.fontFamily = this.value
        });
        tools_edit_text.find("#fontsize").on("input", function () {
            let newSize = $(this).val();
            textBox.css({
                fontSize: newSize + 'px'  
            });
            objectInfo.font_size = newSize + 'px';
        });
        tools_edit_text.find("#bold").on("click", function () {
            let currentWeight = textBox.css('fontWeight');
            
            let isBold = currentWeight === 'bold' || currentWeight === '700';
            
            textBox.css({
                fontWeight: isBold ? 'normal' : 'bold'
            });
            objectInfo.bold = !isBold;
        });
        
        tools_edit_text.find("#italic").on("click", function () {
            let isItalic = textBox.css('fontStyle') === 'italic';
            
            textBox.css({
                fontStyle: isItalic ? 'normal' : 'italic'
            });
            objectInfo.italic = !isItalic;
        });
        
        // Sự kiện xóa text box
        tools_edit_text.find("#textdelete").on("click", function () {
            console.log("da xoa");
            textBox.remove();
            tools_edit_text.remove();
        });
        textBox.on('mousedown', function (tb) {
            tools_edit_text.css({
                display: 'block',
            });

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
                    tools_edit_text.css({
                        left: e.clientX - delta_mouse_to_textbox_X + 'px',
                        top: e.clientY - delta_mouse_to_textbox_Y - 40 + 'px'
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
        textBox.mouseleave(function () { 
            $(canvas).click(function (e) { 
                tools_edit_text.css({
                    display: 'none',
        
                });
                
            });
          
        });
        // // Lắng nghe các thay đổi khác và cập nhật objectInfo
        // $('#fontSize, #fontColor').on('change', function () {
        //     objectInfo.fontSize = $('#fontSize').val()
        //     objectInfo.color = $('#fontColor').val()
        // });

        listObjectTextBoxInfo.push(objectInfo);
    }
}

//hàm render texbox cũ
function redrawTextBoxes(arrayObj) {
    arrayObj.forEach(info => {
            console.log("Drawing text box at:", info.coord_in_doc_X, info.coord_in_doc_Y); // Thêm log để kiểm tra tọa độ
            let textBox = $('<div class="textBox" contenteditable="true"></div>');
            let tools_edit_text = $(
                `<div class="editor-toolbar" id="toolfor${info.item_id}">
                    <select id="fonttext">
                        <option>Helvetica</option>
                        <option>Arial</option>
                        <option>Times New Roman</option>
                    </select>
                    <input type="number" value="${info.font_size}" min="1" step="1" id="fontsize" style="width: 50px;">
                    <button class="icon" id="bold"><b>B</b></button>
                    <button class="icon" id="italic"><i>i</i></button>
                    <button class="icon" id="textdelete"><img src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png" alt="Delete"></button>
                </div>`
            );

            textBox.attr('id', info.item_id); 
       
            textBox.css({
                position: 'absolute',
                display: 'block',
                left: info.coord_in_doc_X + 'px',
                top: info.coord_in_doc_Y + 'px',
                fontSize: info.font_size + 'px',
                color: info.color,
                fontFamily: info.font_family,
                fontWeight: info.bold ? 'bold' : 'normal',
                fontStyle: info.italic ? 'italic' : 'normal',
            });
            
            textBox.text(info.content);
            console.log()
            tools_edit_text.css({
                position: 'absolute',
                display: 'none',
                left: info.coord_in_doc_X + 'px',
                top: info.coord_in_doc_Y - 40 + 'px',
            });
            $("#pdfContainer").append(tools_edit_text);
            $("#pdfContainer").append(textBox);
            tools_edit_text.find("#fonttext").value = info.font_family; 
            tools_edit_text.find("#fonttext").on("change", function () {
                textBox.css({
                    fontFamily:this.value
                })
                info.font_family = this.value
            });
            tools_edit_text.find("#fontsize").on("input", function () {
                let newSize = $(this).val();
                textBox.css({
                    fontSize: newSize + 'px'  
                });
                info.font_size = newSize
            });
            
            tools_edit_text.find("#bold").on("click", function () {
                let currentWeight = textBox.css('fontWeight');
                let isBold = currentWeight === 'bold' || currentWeight === '700';
                
                textBox.css({
                    fontWeight: isBold ? 'normal' : 'bold'
                });
                console.log("is bold:",isBold)

                info.bold = !isBold
            });
            
            tools_edit_text.find("#italic").on("click", function () {
                let isItalic = textBox.css('fontStyle') === 'italic';
                textBox.css({
                    fontStyle: isItalic ? 'normal' : 'italic'
                });
                info.italic = !isItalic
                console.log("is itaclic:",isItalic)

            });
            
            // Sự kiện xóa text box
            tools_edit_text.find("#textdelete").on("click", function () {
                console.log("da xoa");
                textBox.remove();
                tools_edit_text.remove();
            });
    });

    //xử lý textbox đã tồn tại
    $(".textBox").on('mousedown', function (tb) {
        isDragging = true;
        var $textBox = $(tb.target);
        var textBoxId = ($textBox.attr('id'))
        $(`#toolfor${textBoxId}`).css({
            display:"block"
        })

        
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
                $(`#toolfor${textBoxId}`).css({
                    display:"block",
                    left: e.clientX - delta_mouse_to_textbox_X + 'px',
                    top: e.clientY - delta_mouse_to_textbox_Y - 40 + 'px'
                })
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
        $textBox.mouseleave(function () { 
            $("canvas").click(function (e) { 
                $(`#toolfor${textBoxId}`).css({
                    display: 'none',
                    
                });
            });
          
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
