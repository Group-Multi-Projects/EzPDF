var isShapeAdded = false;
var isAddShapesActive = false; // Khai báo biến toàn cục nếu chưa có

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
                addShape(canvas, shapeType,e);
                isShapeAdded = false;  // Đảm bảo chỉ thêm một hình dạng mỗi lần nhấp chuột
            }
        });
    });
}

function addShape(canvas, shapeType,event) {
    if (isAddShapesActive) {
        let uniqueId = 'shape-' + Date.now();
        let shape = $(`<div class="${shapeType}"></div>`);
        shape.attr('id', uniqueId);

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

        $("#pdfContainer").append(shape);  // Thay thế textBox bằng shape

        // Xử lý kéo hình dạng
        shape.on("mousedown", function (e) {
            e.preventDefault();
            
            let offsetX = e.clientX - shape.offset().left;
            let offsetY = e.clientY - shape.offset().top;

            $(document).on("mousemove.drag", function (e) {
                shape.css({
                    left: e.pageX - offsetX,
                    top: e.pageY - offsetY
                });
            });

            $(document).on("mouseup.drag", function () {
                $(document).off("mousemove.drag mouseup.drag");
                isAddShapesActive = false;
            });
        });
    }
}
