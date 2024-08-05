var isShapeAdded = false;
var isAddShapesActive = false; // Khai báo biến toàn cục nếu chưa có
var listObjectShapesInfo = [];

function setupShapesAdding(canvas) {
    $(".button_shape").click(function (shapeEvent) {
        isShapeAdded = true;
        $shape = $(shapeEvent.target);
        isDrawActive = false;
        isAddTextActive = true;
        isAddImageActive = false;
        isAddShapesActive = true;
        let shapeType = $shape.attr('name');

        // Gán sự kiện mousedown chỉ một lần
        $(canvas).off("mousedown").on("mousedown", function (e) {
            if (isShapeAdded) {
                addShape(canvas, shapeType, e);
                isShapeAdded = false; // Đảm bảo chỉ thêm một hình dạng mỗi lần nhấp chuột
            }
        });
    });
}

function addShape(canvas, shapeType, event) {
    if (isAddShapesActive) {
        let objectShapeInfo = createShapeObject(event, canvas);
        listObjectShapesInfo.push(objectShapeInfo); // Save the shape info to the list

        let shape = $(`<div class="${shapeType}"></div>`);
        shape.attr('id', objectShapeInfo.item_id);
        objectShapeInfo.shapeType = shapeType
        switch (shapeType) {
            case "circle":
                shape.css({
                    position: 'absolute',
                    display: 'block',
                    left: event.pageX,
                    top: event.pageY,
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#3498db',
                    borderRadius: '50%'
                });
                break;
            case "square":
                shape.css({
                    position: 'absolute',
                    display: 'block',
                    left: event.pageX,
                    top: event.pageY,
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#3498db',
                });
                break;
            case "rectangle":
                shape.css({
                    position: 'absolute',
                    display: 'block',
                    left: event.pageX,
                    top: event.pageY,
                    width: '150px',
                    height: '100px',
                    backgroundColor: '#3498db',
                });
                break;
            case "triangle":
                shape.css({
                    position: 'absolute',
                    display: 'block',
                    left: event.pageX,
                    top: event.pageY,
                    width: '0',
                    height: '0',
                    borderLeft: '50px solid transparent',
                    borderRight: '50px solid transparent',
                    borderBottom: '100px solid #f39c12',
                });
                break;
            default:
                break;
        }

        $("#pdfContainer").append(shape); 
        objectShapeInfo.color = shape.css("background-color")
        objectShapeInfo.borderRadius = shape.css("border-radius")

        // Xử lý kéo hình dạng
        shape.on("mousedown", function (e) {
            e.preventDefault();

            let offsetX = e.pageX - shape.offset().left;
            let offsetY = e.pageY - shape.offset().top;

            $(document).on("mousemove.drag", function (e) {
                shape.css({
                    left: e.pageX - offsetX,
                    top: e.pageY - offsetY
                });
                console.log(offsetX,offsetY)
                updateShapeInfo(objectShapeInfo.item_id, e.pageX - offsetX, e.pageY - offsetY);
            });

            $(document).on("mouseup.drag", function () {
                $(document).off("mousemove.drag mouseup.drag");
                isAddShapesActive = false;
            });
        });
    }
}

function createShapeObject(mouseEvent, canvas) {
    return {
        file_id: file_id,
        item_id: 'shape-' + Date.now(),
        type: "addshape",
        shapeType:"",
        coord_in_doc_X: mouseEvent.pageX,
        coord_in_doc_Y: mouseEvent.pageY,
        coord_in_canvas_X: mouseEvent.pageX - canvas.offsetLeft,
        coord_in_canvas_Y: mouseEvent.pageY - canvas.offsetTop,
        height: 200,
        width: 200,
        color: '',
        borderRadius: "",
        page: Math.floor(mouseEvent.pageY / PAGE_HEIGHT) + 1,
        canvas_id: canvas.id
    };
}

function updateShapeInfo(itemId, newX, newY) {
    let shapeInfo = listObjectShapesInfo.find(shape => shape.item_id === itemId);
    if (shapeInfo) {
        shapeInfo.coord_in_doc_X = newX;
        shapeInfo.coord_in_doc_Y = newY;
        shapeInfo.coord_in_canvas_X = newX - $('#' + shapeInfo.canvas_id).offset().left;
        shapeInfo.coord_in_canvas_Y = newY - $('#' + shapeInfo.canvas_id).offset().top;
    }
}

$("#saveshapes").on("click", function () {
    console.log(listObjectShapesInfo);
});
function reAddShape(shapes) {
    console.log("readdshape is working")
    shapes.forEach(shapeInfo => {
        let shape = $(`<div class="${shapeInfo.shapeType}"></div>`);
        shape.attr('id', shapeInfo.item_id);
        switch (shapeInfo.shapeType) {
            case "circle":
                shape.css({
                    position: 'absolute',
                    display: 'block',
                    left: shapeInfo.coord_in_doc_X,
                    top: shapeInfo.coord_in_doc_Y,
                    width: shapeInfo.height,
                    height: shapeInfo.width,
                    backgroundColor: shapeInfo.color,
                    borderRadius: shapeInfo.borderRadius
                });
                break;
            case "square":
                shape.css({
                    position: 'absolute',
                    display: 'block',
                    left: shapeInfo.coord_in_doc_X,
                    top: shapeInfo.coord_in_doc_Y,
                    width: shapeInfo.height,
                    height: shapeInfo.width,
                    backgroundColor: shapeInfo.color,
                    borderRadius: shapeInfo.borderRadius
                });
                console.log(shape)
                break;
            case "rectangle":
                shape.css({
                    position: 'absolute',
                    display: 'block',
                    left: shapeInfo.coord_in_doc_X,
                    top: shapeInfo.coord_in_doc_Y,
                    width: shapeInfo.height,
                    height: shapeInfo.width,
                    backgroundColor: shapeInfo.color,
                    borderRadius: shapeInfo.borderRadius
                });
                break;
            case "triangle":
                shape.css({
                    position: 'absolute',
                    display: 'block',
                    left: shapeInfo.coord_in_doc_X,
                    top: shapeInfo.coord_in_doc_Y,
                    width: shapeInfo.height,
                    height: shapeInfo.width,
                    backgroundColor: shapeInfo.color,
                    borderRadius: shapeInfo.borderRadius,
                    borderLeft: '50px solid transparent',
                    borderRight: '50px solid transparent',
                    borderBottom: '100px solid #f39c12',
                });
                break;
            default:
                break;
        }

        $("#pdfContainer").append(shape);

        // Restore drag functionality
        shape.on("mousedown", function (e) {
            e.preventDefault();

            let offsetX = e.pageX - shape.offset().left;
            let offsetY = e.pageY - shape.offset().top;

            $(document).on("mousemove.drag", function (e) {
                shape.css({
                    left: e.pageX - offsetX,
                    top: e.pageY - offsetY
                });

                updateShapeInfo(shapeInfo.item_id, e.pageX - offsetX, e.pageY - offsetY);
            });

            $(document).on("mouseup.drag", function () {
                $(document).off("mousemove.drag mouseup.drag");
                isAddShapesActive = false;
            });
        });

        listObjectShapesInfo.push(shapeInfo); 
    });
}

//lấy dữ liệu các shape đã lưu
$(document).ready(function () {
    var tools_api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3NjkzNDU3LCJpYXQiOjE3MjI1MDk0NTcsImp0aSI6Ijk3MDg3ZGQ0ZWFiMzQ1NGRiOGMwZGRhMDYzYzQ4MWRmIiwidXNlcl9pZCI6Mn0._hZZoyZpB6RdTnubLUd0u0ZrZ44KJXVWqHY2npVooYk";
    $.ajax({
        type: "GET",
        url: `http://127.0.0.1:8000/tools/shape_added_api/${file_id}/`,
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + tools_api_token
        },
        success: function (response) {
            console.log("Shape api received:", response); 
            reAddShape(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error in AJAX request for PDF:', textStatus, errorThrown);
        }
    });
});
