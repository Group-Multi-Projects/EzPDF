var isShapeAdded = false;
var isAddShapesActive = false; 
var listObjectShapesInfo = [];
var currentShapeType = null; 
var objectShapeInfo = {
    item_id: "",
    type: "addshape",
    coord_in_canvas_X: 0,
    coord_in_canvas_Y: 0,
    width: 0,
    height: 0,
    fill: 'black',
    radius:0,
    angle:0,
    shape_type:''
}
function setupShapesAdding(fabricCanvas, numPages) {
    // Thiết lập sự kiện click cho tất cả các phần tử có class là .button_shape
    $(".button_shape").on("click", function (shapeEvent) {
        isShapeAdded = true;
        // Lấy phần tử đã được nhấn
        $shape = $(this); // Sử dụng `this` để lấy phần tử hiện tại
        isDrawActive = false;
        isAddTextActive = false;
        isAddShapesActive = true;
        isAddImageActive = false;
        
        // Lấy giá trị của thuộc tính `name` của phần tử
        currentShapeType = $shape.attr('name');
        console.log("Add:", currentShapeType);

        // Thiết lập sự kiện mouse:down cho canvas
        fabricCanvas.on("mouse:down", function (e) {
            if (isShapeAdded && currentShapeType) {
                console.log("helo");
                handleCreateFabricShape(fabricCanvas, currentShapeType, e, numPages);
                isShapeAdded = false; // Đặt lại trạng thái để ngăn thêm hình ảnh nhiều lần
            }
        });
    });
}

function handleCreateFabricShape(fabricCanvas, shapeType, mouseEvent,numPages) {
    if (isAddShapesActive) {
        let pointer = fabricCanvas.getPointer(mouseEvent.e);
        let uniqueId = 'shape-' + Date.now()
        let tool_edit_shape = 
        $(`
        <div class="editor-toolbar" id="toolfor${uniqueId}">
            <button class="icon" id="shapedelete"><img src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png" alt="Delete"></button>
            <input type="color" id="shapefavcolor-${uniqueId}" name="favcolor" value="#ff0000">

        </div>
        `)
        // shape kiểu dữ liệu là fabric object
        let shape = createFabricShape(fabricCanvas,shapeType,pointer.x,pointer.y,uniqueId,tool_edit_shape,objectShapeInfo)
        var objectInfo = Object.assign({}, objectShapeInfo, {
            item_id: shape.id,
            shape_type: shapeType,
            coord_in_canvas_X: shape.left,
            coord_in_canvas_Y: shape.top,
            width: shape.width || shape.radius * 2,
            height: shape.height || shape.radius * 2,
            fill: shape.fill,
            radius:shape.radius || 0,
            page:numPages,
            angle:shape.angle,
            // color:shape.fill
        });
        listObjectShapesInfo.push(objectInfo);
        fabricCanvas.renderAll();
    }
}
function createFabricShape(fabricCanvas,shapeType, left, top, uniqueId,tool_edit_shape,objInfo) {
    var shape = null; // Khởi tạo biến shape một lần
    try {
        switch (shapeType) {
            case 'circle':
                shape = new fabric.Circle({
                    left: left,
                    top: top,
                    radius: objInfo.width /2 || 50,
                    fill: 'red',
                    selectable: true,
                    id: uniqueId
                });
                break;
            case 'square':
                shape = new fabric.Rect({
                    left: left,
                    top: top,
                    width:  objInfo.width || 100,
                    height: objInfo.height || 100,
                    fill: 'blue',
                    selectable: true,
                    id: uniqueId
                });
                break;
            case 'rectangle':
                shape = new fabric.Rect({
                    left: left,
                    top: top,
                    width:  objInfo.width || 150,
                    height: objInfo.height || 100,
                    fill: 'green',
                    selectable: true,
                    id: uniqueId
                });
                break;
            case 'triangle':
                shape = new fabric.Triangle({
                    left: left,
                    top: top,
                    width:  objInfo.width || 100,
                    height: objInfo.height || 100,
                    fill: 'yellow',
                    selectable: true,
                    id: uniqueId
                });
                break;
            default:
                console.log('Shape type not recognized');
                return null; // Trả về null nếu không nhận diện được loại shape
        }
    } catch (error) {
        console.log(error)
    }
    
    let position = getShapePositionRelativeToDocument(shape,fabricCanvas)
    $("#pdfContainer").append(tool_edit_shape)

    tool_edit_shape.css({
        position: 'absolute',
        display: 'block',
        left: position.left + (shape.width / 2) - (tool_edit_shape.outerWidth() / 2) + 'px',
        top: position.top - tool_edit_shape.outerHeight() - 250 + 'px', // cách phía trên một khoảng 10px
    });
    $("#shapedelete").on("click",function () {
        // let activeObject = fabricCanvas.getActiveObject();
        tool_edit_shape.remove();
        if (true) {
            fabricCanvas.remove(shape);
    
            let indexToRemove = listObjectShapesInfo.findIndex(objInfo => objInfo.item_id === shape.id);
            
            if (indexToRemove !== -1) {
                const item_id = listObjectShapesInfo[indexToRemove].item_id

                listObjectShapesInfo.splice(indexToRemove, 1);
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
    })
    $(`#shapefavcolor-${shape.id}`).on("input", function() {
        // Get the hex color value from the input
        let hexColor = $(this).val();
    
        // Set the fill color of the shape
        shape.set({ fill: hexColor }); // Update the shape's fill property
    
        // Convert hex color to RGB (optional)
        let rgbColor = hexToRgb(hexColor);
        console.log("RGB Color:", rgbColor); // Example output: { r: 255, g: 87, b: 51 }
    
        // Re-render the canvas to reflect the color change
        fabricCanvas.renderAll();
    });
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
    // Add the shape to the canvas 
    fabricCanvas.add(shape);
    handleMouseShapeEvents(shape,fabricCanvas,tool_edit_shape)

    return shape;
}

function getShapePositionRelativeToDocument(shape, fabricCanvas) {
    var shapeLeft = shape.left;
    var shapeTop = shape.top;

    var canvasElement = fabricCanvas.getElement();
    var canvasRect = canvasElement.getBoundingClientRect();

    var shapeLeftInDocument = shapeLeft + canvasRect.left;
    var shapeTopInDocument = shapeTop + canvasRect.top;

    return {
        left: shapeLeftInDocument,
        top: shapeTopInDocument
    };
}
function handleMouseShapeEvents(shape,fabricCanvas,tool_edit_shape) {

    shape.on('moving', function() {
        updateShapeInfo(shape);
        let position = getShapePositionRelativeToDocument(shape, fabricCanvas);
    
        let scaledWidth = shape.width
        tool_edit_shape.css({
            position: 'absolute',
            display: 'block',
            left: position.left + (scaledWidth / 2) - (tool_edit_shape.outerWidth() / 2) + 'px',
            top: position.top - tool_edit_shape.outerHeight() - 250 + 'px', // cách phía trên một khoảng 10px
        });
    });

    shape.on('scaling', function() {
        let position = getShapePositionRelativeToDocument(shape, fabricCanvas);
        
        let scaledWidth = shape.width * shape.scaleX;
        updateShapeInfo(shape);
        tool_edit_shape.css({
            position: 'absolute',
            display: 'block',
            left: position.left + (scaledWidth / 2) - (tool_edit_shape.outerWidth() / 2) + 'px',
            top: position.top - tool_edit_shape.outerHeight() - 250 + 'px', // cách phía trên một khoảng 10px
        });
    });
    

    shape.on('rotating', function() {
        updateShapeInfo(shape);
    });
}
function updateShapeInfo(shape) {
    var item_id = shape.get('id');
    var objectInfo = listObjectShapesInfo.find(function(info) {
        return info.item_id === item_id;
    });

    if (objectInfo) {
        // Cập nhật thông tin đối tượng với các giá trị mới
        objectInfo.coord_in_canvas_X = shape.left;
        objectInfo.coord_in_canvas_Y = shape.top;
        objectInfo.width = shape.width * shape.scaleX; // Cập nhật với scale mới
        objectInfo.height = shape.height * shape.scaleY; // Cập nhật với scale mới
        objectInfo.angle = shape.angle; // Cập nhật góc xoay (nếu cần)
        objectInfo.fill = shape.fill,
        objectInfo.radius = shape.radius || 0,
        objectInfo.angle = shape.angle
        console.log(objectInfo.width,objectInfo.height)
    }
}
function reAddShapes(listObjectShapesInfo) {
    listObjectShapesInfo.forEach(element => {
        let fabricCanvas = fabricCanvasInstances[element.page]
        let tool_edit_shape = 
        $(`
        <div class="editor-toolbar" id="toolfor${element.item_id}">
            <button class="icon" id="shapedelete"><img src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png" alt="Delete"></button>
            <input type="color" id="shapefavcolor-${element.item_id}" name="favcolor" value="#ff0000">
        </div>
        `)
        let shape = createFabricShape(fabricCanvas,element.shape_type,element.coord_in_canvas_X,element.coord_in_canvas_Y,element.item_id,tool_edit_shape,element)
        // Render the canvas to show the shape
        fabricCanvas.renderAll();
    });
}
$("#saveshapes").on("click",function () {
    console.log("List shapes:",listObjectShapesInfo)
})
function renderShapes() {
    $(document).ready(function () {
        const token = document.querySelector("#user-token").textContent
        $.ajax({
            type: "GET",
            url: `/tools/shape_added_api/${file_id}/`,
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (response) {
                console.log("Shape api received:", response); 
                listObjectShapesInfo = response
                reAddShapes(listObjectShapesInfo);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error in AJAX request for PDF:', textStatus, errorThrown);
            }
        });
    });   
}
