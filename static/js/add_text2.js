var isCreated = false
var objectTextBoxInfo = {
    file_id: file_id,
    item_id:0,
    type: "addtext",
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
var listObjectTextBoxInfo = []
function setupTextAdding(fabricCanvas,numPages) {
    $("#add_text").click(function () {
        isDrawActive = false;
        isAddTextActive = true;
        isAddImageActive = false;
        isAddShapesActive = false;
        var objTextEdit = {};
        
        // Đặt sự kiện cho Fabric.js canvas
        fabricCanvas.on('mouse:down', function(event) {
            if (isAddTextActive) {
                isCreated = false;
                let pointer = fabricCanvas.getPointer(event.e);
                objTextEdit = handleCreateTextBox(event.e);
                let tools_edit_text = objTextEdit.tools_edit_text;
                let textBox = objTextEdit.textBox;
                $('body').append(textBox);
                textBox.focus();
        textBox.on('keypress', function(e) {
            if (e.which === 13 && isCreated == false) {  // Kiểm tra phím Enter (mã phím 13)
                handleTextCreation();
            }
        });

        // Sự kiện khi click ra ngoài textbox
        textBox.on('blur', function() {
            if (isCreated == false) {
                handleTextCreation();
            }
        });

        function handleTextCreation() {
            let textValue = textBox.text();
            let textId = textBox.attr("id");
            if (textValue.trim()) {  // Kiểm tra nếu không phải là chuỗi rỗng
                var objInfo = handleCreateFabricText(fabricCanvas, textBox, pointer, numPages);
                listObjectTextBoxInfo.push(objInfo);
            }
            textBox.css({ display: 'none' });
            tools_edit_text.css({ display: "none" });
            isAddTextActive = false;
            fabricCanvas.off('mouse:down');
        }

                isAddTextActive = false;
            }
        });
        setupEditTextDoubleClick(fabricCanvas);
    });
}
// hàm tạo textbox và tools edit từ người dùng
function handleCreateTextBox(e) {
    let uniqueId = 'textBox-' + Date.now();
    let textBox = $(`<div class="textBox" contenteditable="true" id="${uniqueId}">Enter text here</div>`);
    let tools_edit_text = $(
        `<div class="editor-toolbar" id="toolfor${uniqueId}">
            <select id="fonttext">
                <option>Helvetica</option>
                <option>Arial</option>
                <option>Times New Roman</option>
            </select>
            <input type="number" value="11" min="1" step="1" id="fontsize" style="width: 50px;">
            <label>
                <input type="checkbox" id="bold">
                <b>B</b>
            </label>
            <label>
                <input type="checkbox" id="italic">
                <i>i</i>
            </label>
            <button class="icon btn btn-outline-secondary btn-sm" id="textdelete">
                <i class="bi bi-trash"></i>
            </button>        
            <input type="color" id="favcolor" name="favcolor" value="#ff0000">
        </div>`
    );
    textBox.css({
        position: 'absolute',
        display: 'block',
        left: e.pageX + 'px',
        top: e.pageY + 'px',
        fontSize: tools_edit_text.find('#fontsize').val() + 'px', // Cập nhật kích thước font từ input
        color: $('#fontColor').val() || '#000000', // Đảm bảo có phần tử fontColor hoặc thay bằng giá trị mặc định
    });
    tools_edit_text.css({
        position: 'absolute',
        display: 'block',
        left: e.pageX + 'px',
        top: e.pageY - 40 + 'px',
    });
    handleEditEvents(textBox,tools_edit_text)

    $('body').append(tools_edit_text); // Thêm thanh công cụ vào body
    var objTextBoxEdit = {
        textBox: textBox,
        tools_edit_text: tools_edit_text
    };
    return objTextBoxEdit;
}

// hàm tạo textbox và tools edit từ database

function handleCreateTextBoxExisted(objectInfo) {
    let textBox = $(`<div class="textBox" contenteditable="true" id="${objectInfo.item_id}">Enter text here</div>`);
    let tools_edit_text = $(
        `<div class="editor-toolbar" id="toolfor${objectInfo.item_id}">
            <select id="fonttext">
                <option>Helvetica</option>
                <option>Arial</option>
                <option>Times New Roman</option>
            </select>
            <input type="number" value="${objectInfo.font_size}" min="1" step="1" id="fontsize" style="width: 50px;">
            <label>
                <input type="checkbox" id="bold" checked>
                <b>B</b>
            </label>
            <label>
                <input type="checkbox" id="italic" checked>
                <i>i</i>
            </label>
            <button class="icon" id="textdelete"><img src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png" alt="Delete"></button>
            <input type="color" id="favcolor" name="favcolor" value="#ff0000">
        </div>`
    );
    textBox.css({
        position: 'absolute',
        display: 'block',
        left: objectInfo.left + 'px',
        top: objectInfo.top + 'px',
        fontSize: objectInfo.font_size + 'px', // Cập nhật kích thước font từ input
        color: $('#fontColor').val() || 'red', // Đảm bảo có phần tử fontColor hoặc thay bằng giá trị mặc định
    });
    tools_edit_text.css({
        position: 'absolute',
        display: 'block',
        left: objectInfo.left + 'px',
        top: objectInfo.top - 40 + 'px',
    });
    handleEditEvents(textBox,tools_edit_text)

    $('body').append(tools_edit_text,textBox); // Thêm thanh công cụ vào body
    // var objTextBoxEdit = {
    //     textBox: textBox,
    //     tools_edit_text: tools_edit_text
    // };
    // return objTextBoxEdit;
}
function handleCreateFabricText(fabricCanvas, textBox, pointer,numPages) {
    if (textBox.text()) {
        // Tạo một đối tượng văn bản Fabric.js mới
        let text = new fabric.Text(textBox.text(), {
            left: pointer.x, // Vị trí X của văn bản
            top: pointer.y, // Vị trí Y của văn bản
            fontFamily: $('#fonttext').val(), // Lấy font từ select
            fontSize:parseInt(textBox.css('fontSize')), // Lấy kích thước từ input, chuyển đổi thành số nguyên
            fill: $('#fontColor').val() || '#000000', // Màu sắc của văn bản
            id: textBox.attr("id"),
            fontWeight: $('#bold').is(':checked') ? 'bold' : 'normal', // Đặt độ đậm của chữ
            fontStyle: $('#italic').is(':checked') ? 'italic' : 'normal' // Đặt kiểu chữ nghiêng
        });
        
        // Thêm văn bản vào canvas
        fabricCanvas.add(text);
        console.log(textBox.attr("id"));

        // Đặt đối tượng văn bản là đối tượng hoạt động hiện tại
        fabricCanvas.setActiveObject(text);
        console.log("Day la trang:",numPages)
        var objectInfo = Object.assign({}, objectTextBoxInfo, {
            item_id:textBox.attr("id"),
            coord_in_canvas_X: text.left,
            coord_in_canvas_Y: text.top,
            content: textBox.text(),
            font_size: text.fontSize,
            page: numPages,
            font_family: text.fontFamily,
            bold: text.fontWeight === 'bold',
            italic: text.fontStyle === 'italic',
            color: text.fill
        });
        // Theo dõi sự kiện di chuyển của đối tượng văn bản để cập nhật `objectInfo`
        text.on('moving', function() {
            objectInfo.coord_in_canvas_X = text.left;
            objectInfo.coord_in_canvas_Y = text.top;
        });

        return objectInfo;
    }
    return null;
}
function removeTextById(fabricCanvas, textId) {
    let objects = fabricCanvas.getObjects('text'); // Lấy tất cả đối tượng văn bản trên canvas
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].id === textId) { // Kiểm tra id của đối tượng văn bản
            fabricCanvas.remove(objects[i]); // Xóa đối tượng văn bản khỏi canvas
            fabricCanvas.renderAll(); // Cập nhật canvas
            break;
        }
    }
}
function setupEditTextDoubleClick(fabricCanvas) {
    fabricCanvas.on('mouse:dblclick', function(event) {
        isCreated = true
        let activeObject = fabricCanvas.getActiveObject();
        
        if (activeObject && activeObject.type === 'text') {
            let textId = activeObject.id; // Lấy id của đối tượng văn bản
            console.log('ID của văn bản:', textId);

            let $textBox = $(`#${textId}`);
            let $tools_edit_text = $(`#toolfor${textId}`);

            // Lấy vị trí của đối tượng văn bản trên canvas
            let canvasOffset = $(fabricCanvas.getElement()).offset();
            let top = canvasOffset.top + activeObject.top;
            let left = canvasOffset.left + activeObject.left;

            // Hiển thị và căn chỉnh div và công cụ chỉnh sửa
            $textBox.css({
                display: "block",
                position: "absolute",
                left: left + 'px',
                top: top + 'px',
                width: activeObject.width + 'px',
                height: activeObject.height + 'px',
                overflow: "hidden"
            }).text(activeObject.text); // Hiển thị văn bản hiện tại trong div

            $tools_edit_text.css({
                position: 'absolute',
                display: 'block',
                left: left + 'px',
                top: top - 40 + 'px', // Điều chỉnh theo yêu cầu của bạn
            });

            // Ẩn đối tượng văn bản trên canvas
            activeObject.set({ visible: false });
            fabricCanvas.renderAll(); // Cập nhật canvas
            handleEditEvents($textBox,$tools_edit_text,activeObject,textId,fabricCanvas)
            // Cập nhật văn bản khi thay đổi trong div
            $textBox.on("input", function () {
                let newText = this.textContent;
                
                activeObject.set({ text: newText });
                fabricCanvas.renderAll(); // Cập nhật canvas
                listObjectTextBoxInfo.forEach(objInfo => {
                    if(objInfo.item_id === textId) {
                        objInfo.content = newText
                    }
                });
            });


            // Ẩn div khi người dùng nhấp ra ngoài
            $(document).on("click.hideTextBox", function(event) {
                if (!$(event.target).closest(`#${textId}`).length && !$(event.target).closest(`#toolfor${textId}`).length) {
                    $textBox.css({ display: "none" });
                    $tools_edit_text.css({ display: "none" });

                    // Hiển thị lại đối tượng văn bản và cập nhật canvas
                    activeObject.set({ visible: true });
                    fabricCanvas.renderAll(); // Cập nhật canvas
                    $(document).off("click.hideTextBox"); // Hủy sự kiện click sau khi xử lý
                }
            });
        }
    });
}
function handleEditEvents(textBox,tools_edit_text,activeObject,textId,fabricCanvas) {
    tools_edit_text.find("#fonttext").on("change", function () {
        textBox.css({
            fontFamily:this.value
        })
        if (activeObject) {
            activeObject.set({ fontFamily: this.value });
                listObjectTextBoxInfo.forEach(objInfo => {
                    if(objInfo.item_id === textId) {
                        objInfo.font_family = this.value
                    }
            });
        }
    });
    console.log(tools_edit_text.find("#fontsize"))
    tools_edit_text.find("#fontsize").on("input", function () {
        // Retrieve current padding as an integer (assuming padding is in pixels)
        let curren_height_tools_div = parseInt(tools_edit_text.css("height")) || 0;
        let curren_width_tools_div = parseInt(tools_edit_text.css("width")) || 0;
        let newSize = $(this).val();
        
        // Update the padding by scaling it based on the new font size
        tools_edit_text.css({
            height: (curren_height_tools_div * newSize) + 'px',
            width: (curren_width_tools_div * newSize) + 'px'
        });
    
        console.log('Font size and padding updated');
    
        // Update the font size of the text box
        textBox.css({
            fontSize: newSize + 'px'  
        });
    
        // Update font size in active Fabric.js object, if applicable
        if (activeObject) {
            activeObject.set({ fontSize: parseInt(newSize) });
            listObjectTextBoxInfo.forEach(objInfo => {
                if(objInfo.item_id === textId) {
                    objInfo.font_size = parseInt(newSize);
                }
            });
        }
    });
    
        // Xử lý sự kiện cho checkbox chữ đậm
    tools_edit_text.find("#bold").on("change", function () {
        let isBold = $(this).is(':checked'); // Kiểm tra trạng thái của checkbox
        textBox.css({
            fontWeight: isBold ? 'bold' : 'normal'
        });
        if (activeObject) {
            activeObject.set({ fontWeight: isBold ? 'bold' : 'normal' });
          // Cập nhật canvas để phản ánh sự thay đổi
            listObjectTextBoxInfo.forEach(objInfo => {
                if (objInfo.item_id === textId) {
                    objInfo.bold = isBold;
                }
            });
        }
    });

    // Xử lý sự kiện cho checkbox chữ nghiêng
    tools_edit_text.find("#italic").on("change", function () {
        let isItalic = $(this).is(':checked'); // Kiểm tra trạng thái của checkbox
        textBox.css({
            fontStyle: isItalic ? 'italic' : 'normal'
        });
        if (activeObject) {
            activeObject.set({ fontStyle: isItalic ? 'italic' : 'normal' });
            listObjectTextBoxInfo.forEach(objInfo => {
                if (objInfo.item_id === textId) {
                    objInfo.italic = isItalic;
                }
            });
        }
    });
    tools_edit_text.find("#textdelete").on("click", function () {
        textBox.remove(); // Xóa `textBox` khỏi DOM
        tools_edit_text.remove(); // Xóa thanh công cụ chỉnh sửa khỏi DOM
        
        if (activeObject) {
            fabricCanvas.remove(activeObject); // Xóa đối tượng khỏi canvas
    
            // Tìm chỉ mục của phần tử cần xóa trong `listObjectTextBoxInfo`
            let indexToRemove = listObjectTextBoxInfo.findIndex(objInfo => objInfo.item_id === textId);
            
            if (indexToRemove !== -1) {
                const item_id = listObjectTextBoxInfo[indexToRemove].item_id

                listObjectTextBoxInfo.splice(indexToRemove, 1); // Xóa phần tử khỏi danh sách
                const token = document.querySelector("#user-token").textContent
                console.log(item_id)
                $.ajax({
                    type: "DELETE",
                    url: `/tools/tools_api/${item_id}/`,
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                    success: function (response) {
                        console.log("Text deleted successfully");
                    },
                    error: function (xhr, status, error) {
                        console.log("Error deleting text:", error);
                    }
                });
            }
        }
    });
    tools_edit_text.find("#favcolor").on("input", function () {
        // Get the hex color value from the input
        let hexColor = $(this).val();
    
        // Convert hex color to RGB
        let rgbColor = hexToRgb(hexColor);
    
        console.log("RGB Color:", rgbColor); // Example output: { r: 255, g: 87, b: 51 }
        textBox.css({
            color: hexColor
        });
        if (activeObject) {
            activeObject.set({ fill: hexColor});
            listObjectTextBoxInfo.forEach(objInfo => {
                if (objInfo.item_id === textId) {
                    objInfo.color = rgbColor;
                }
            });
        }
    });
    
    // Helper function to convert hex to RGB
    function hexToRgb(hex) {
        // Remove the '#' if present
        hex = hex.replace("#", "");
    
        // Parse the hex color values
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
    
        // Return RGB values in an object
        return { r: r, g: g, b: b };
    }
    
    }
function readdtext(listObjectTextBoxInfo) {
    console.log(listObjectTextBoxInfo);
    listObjectTextBoxInfo.forEach(function (objInfo) {
        let text = new fabric.Text(objInfo.content, {
            left: objInfo.coord_in_canvas_X, 
            top: objInfo.coord_in_canvas_Y, 
            fontFamily: objInfo.font_family, 
            fontSize: parseInt(objInfo.font_size),
            fill: "red",
            fontWeight: objInfo.bold ? 'bold' : 'normal', 
            fontStyle: objInfo.italic ? 'italic' : 'normal', 
            id: objInfo.item_id
        });
            text.on('moving', function() {
                objInfo.coord_in_canvas_X = text.left;
                objInfo.coord_in_canvas_Y = text.top;
            });
        let fabricCanvasInstance = fabricCanvasInstances[objInfo.page];
        if (fabricCanvasInstance) {
            fabricCanvasInstance.add(text);
            fabricCanvasInstance.setActiveObject(text);
            handleCreateTextBoxExisted(objInfo)
            setupEditTextDoubleClick(fabricCanvasInstance)
        } else {
            console.error('Fabric canvas for page', objInfo.page, 'not found');
        }
    });
}
$("#readdtext").click(function (e) { 
    console.log(listObjectTextBoxInfo)
    e.preventDefault();
    
});
function renderText() {
    const token = document.querySelector("#user-token").textContent
    $.ajax({
        type: "GET",
        url: `/tools/text_added_api/${file_id}/`,
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            listObjectTextBoxInfo = response;
            console.log("Text added api Received response:", response); 
            readdtext(listObjectTextBoxInfo);
        },
        error: function (jqXHR, textStatus, errorThrown) {
    
            console.error('Lỗi trong yêu cầu AJAX cho PDF:', textStatus, errorThrown);
        }
    });
}
