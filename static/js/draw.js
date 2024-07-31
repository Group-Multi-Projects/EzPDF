var listObjectDrawInfo = [];
var currentPage = 1; // Biến để lưu trang hiện tại

function drawing(canvas, ctx) {
    var isDrawing = false;
    var drawingPoints = [];
    var restoreArray = [];
    let index = -1;

    penBtn.on("click", function () {
        isDrawActive = true;
        isAddTextActive = false;
        restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;

        $(canvas).on('mousedown', function (e) {
            isDrawing = true;
            ctx.beginPath(); // Bắt đầu một đường mới khi bắt đầu vẽ
            draw(e);
        });

        $(canvas).on('mousemove', draw);

        $(canvas).on('mouseup', function () {
            let objectDrawInfo = {
                type: "draw",
                coordinates: drawingPoints.slice(),
                page: this.id, // Lưu thông tin trang hiện tại
                draw_id:""
            };
            let uniqueId = 'draw-' + Date.now(); // Ví dụ: 'draw-1690992901876'
            objectDrawInfo.draw_id = uniqueId
            drawingPoints = [];
            restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            index += 1;
            if (isDrawActive) {
         
                listObjectDrawInfo.push(objectDrawInfo);
            }
            isDrawing = false;

        });

        $(canvas).on('mouseleave', function () {
            if (isDrawing) {
                isDrawing = false;
                let objectDrawInfo = {
                    type: "addtext",
                    coordinates: drawingPoints.slice(),
                    page: this.id // Lưu thông tin trang hiện tại
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

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (restoreArray.length > 0) {
            ctx.putImageData(restoreArray[restoreArray.length - 1], 0, 0);
        }

        listObjectDrawInfo.forEach(object => {
            if (!object.coordinates.length) return;
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'red';

            ctx.beginPath();

            for (let i = 0; i < object.coordinates.length; i++) {
                if (i === 0) {
                    ctx.moveTo(object.coordinates[i].x, object.coordinates[i].y);
                } else {
                    ctx.lineTo(object.coordinates[i].x, object.coordinates[i].y);
                }
            }

            ctx.stroke();
        });
    }

    $('#saveDrawing').on('click', function () {
        console.log(listObjectDrawInfo);
    });

    $('#redraw').on('click', function () {
        redraw();
    });

    console.log("Draw is working!");
}

// Hàm để cập nhật trang hiện tại khi người dùng chuyển trang
function updateCurrentPage(newPage) {
    currentPage = newPage;
}
