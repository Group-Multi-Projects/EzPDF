var listObjectDrawInfo = [];
var currentPage = 1; // Variable to store the current page

function drawing(canvas, ctx) {
    var isDrawing = false;
    var drawingPoints = [];
    var restoreArray = [];
    let index = -1;

    penBtn.on("click", function () {
        isDrawActive = true;
        isAddTextActive = false;
        isAddImageActive = false;
        isAddShapesActive = false;

        restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;

        $(canvas).on('mousedown', function (e) {
            isDrawing = true;
            ctx.beginPath(); 
            draw(e);
        });

        $(canvas).on('mousemove', draw);

        $(canvas).on('mouseup', function () {
            if (isDrawing) {
                isDrawing = false;
                let objectDrawInfo = {
                    type: "draw",
                    coordinates: drawingPoints.slice(),
                    page: canvas.id, 
                    item_id: 'draw-' + Date.now() 
                };
                drawingPoints = [];
                restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                index += 1;
                if (isDrawActive) {
                    listObjectDrawInfo.push(objectDrawInfo);
                }
            }
        });

        $(canvas).on('mouseleave', function () {
            if (isDrawing) {
                isDrawing = false;
                let objectDrawInfo = {
                    type: "draw",
                    coordinates: drawingPoints.slice(),
                    page: canvas.id
                };
                drawingPoints = [];
                restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                index += 1;
            }
        });
    });

    function draw(e) {
        if (isDrawActive) {
            if (!isDrawing || !pdfDocument) return;

            let rect = canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'black';

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);

            drawingPoints.push({ x: x, y: y });
        }
    }


  

    console.log("Draw is working!");
}
$('#saveDrawing').on('click', function () {
    console.log(listObjectDrawInfo);
});

$('#redraw').on('click', function () {
    var page = 0
    var canvasList = document.querySelectorAll("canvas")
    for (let index = 0; index < listObjectDrawInfo.length; index++) {
        canvas = canvasList[(listObjectDrawInfo[index].page - 1)]
        page = listObjectDrawInfo[index].page
        redraw(listObjectDrawInfo,canvas,page);
    }
});
function redraw(drawInfoList,canvas,page) {
    var ctx = canvas.getContext('2d');
    var index = page - 1
    for (var i = index; i < drawInfoList.length; i++) {
        var drawInfo = drawInfoList[i];
        if (drawInfo.page === page) {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'red';
    
            for (var j = 0; j < drawInfo.coordinates.length; j++) {
                var point = drawInfo.coordinates[j];
                if (j === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                }
            }
    
            ctx.stroke();
        }

        }
}
//lấy dữ liệu các textbox đã lưu
$(document).ready(function () {
    var tools_api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3NjkzNDU3LCJpYXQiOjE3MjI1MDk0NTcsImp0aSI6Ijk3MDg3ZGQ0ZWFiMzQ1NGRiOGMwZGRhMDYzYzQ4MWRmIiwidXNlcl9pZCI6Mn0._hZZoyZpB6RdTnubLUd0u0ZrZ44KJXVWqHY2npVooYk";
    
    // Tạo một hàm để thực hiện yêu cầu AJAX
    function fetchDrawInfo() {
        $.ajax({
            type: "GET",
            url: `http://127.0.0.1:8000/tools/draw_added_api/${file_id}/`,
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + tools_api_token
            },
            success: function (response) {
                var canvas_list = getCanvasList();
                listObjectDrawInfo = response;
                console.log("Draws added api Received response:", response); 
                let page = 0
                for (let index = 0; index < listObjectDrawInfo.length; index++) {
                    canvas = canvas_list.canvasList[(listObjectDrawInfo[index].page - 1)]
                    page = listObjectDrawInfo[index].page
                    redraw(listObjectDrawInfo,canvas,page);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Lỗi trong yêu cầu AJAX cho PDF:', textStatus, errorThrown);
            }
        });
    }
    
    // Tạo một MutationObserver để theo dõi khi các canvas được thêm vào
    var observer = new MutationObserver(function(mutations) {
        var canvas_list = getCanvasList();
        if (canvas_list.canvasList.length == canvas_list.quantityPage) {
            fetchDrawInfo();
            
            // Ngừng quan sát sau khi đã thực hiện xong AJAX
            observer.disconnect();
        }
    });
    
    // Bắt đầu theo dõi phần tử chứa các canvas
    observer.observe(document.getElementById('pdfContainer'), { childList: true });
});
