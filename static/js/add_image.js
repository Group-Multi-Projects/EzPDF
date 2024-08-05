var listObjectImageInfo = [];
var reader = new FileReader();
var isImageAdded = false;

function setupImageAdding(canvas) {
    var imageInput = document.getElementById('add_image');
// Thêm hàm gọi `reAddImage` khi cần thiết
    imageInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            // Reset states
            isDrawActive = false;
            isAddTextActive = false;
            isAddShapesActive = false;
            isAddImageActive = true;
            $(canvas).on('mousedown', function(event) {
   
                    addImageToCanvas(this, e.target.files[0], event);
                    isAddImageActive = false   
            }); 
            }
        }
    );
}

function addImageToCanvas(canvas, file, mouseEvent) {
    if (isAddImageActive) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const objectImageInfo = createImageObject(file, event.target.result, mouseEvent, canvas);
    
            const imgElement = document.createElement('img');
            imgElement.id = objectImageInfo.item_id;
            imgElement.src = objectImageInfo.image;
            imgElement.style.position = 'absolute';
            imgElement.style.left = `${objectImageInfo.coord_in_doc_X}px`;
            imgElement.style.top = `${objectImageInfo.coord_in_doc_Y}px`;
            imgElement.style.width = `${objectImageInfo.width}px`;
            imgElement.style.height = `${objectImageInfo.height}px`;
    
            document.getElementById('pdfContainer').appendChild(imgElement);
            is_append = true
            handleImageAction(canvas, imgElement.id, objectImageInfo);
            listObjectImageInfo.push(objectImageInfo);
        };
    
        reader.readAsDataURL(file);
    }
   
}

function createImageObject(file, src, mouseEvent, canvas) {
    console.log("Src:",src)
    return {
        file_id: file_id,
        image: src,
        item_id: 'image-' + Date.now(),
        type: "addimage",
        coord_in_doc_X: mouseEvent.pageX,
        coord_in_doc_Y: mouseEvent.pageY,
        coord_in_canvas_X: mouseEvent.pageX - canvas.offsetLeft,
        coord_in_canvas_Y: mouseEvent.pageY - canvas.offsetTop,
        height: 200,
        width: 200,
        page: Math.floor(mouseEvent.pageY / PAGE_HEIGHT) + 1,
        canvas_id:canvas.id
    };
}


function handleImageAction(canvas, imageId, objectImageInfo) {
    const imgElement = document.getElementById(imageId);
    let isDragging = false;
    let startMousePos = { x: 0, y: 0 };
    let initialPos = { left: 0, top: 0 };

    imgElement.addEventListener('mousedown', function(e) {
        isDragging = true;
        startMousePos = { x: e.clientX, y: e.clientY };
        initialPos = { left: parseInt(imgElement.style.left, 10), top: parseInt(imgElement.style.top, 10) };
        console.log(canvas)
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaX = e.clientX - startMousePos.x;
            const deltaY = e.clientY - startMousePos.y;
            imgElement.style.left = (initialPos.left + deltaX) + 'px';
            imgElement.style.top = (initialPos.top + deltaY) + 'px';

            // Update image info
            objectImageInfo.coord_in_canvas_X = imgElement.offsetLeft - canvas.offsetLeft;
            objectImageInfo.coord_in_canvas_Y = imgElement.offsetTop - canvas.offsetTop;
            console.log(objectImageInfo.coord_in_canvas_X,objectImageInfo.coord_in_canvas_Y)
            objectImageInfo.coord_in_doc_X = imgElement.offsetLeft;
            objectImageInfo.coord_in_doc_Y = imgElement.offsetTop;

        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            isAddImageActive = false
            updateImageInfo(objectImageInfo);
        }
    });
}

function updateImageInfo(updatedImageInfo) {
    const index = listObjectImageInfo.findIndex(info => info.item_id === updatedImageInfo.item_id);
    if (index > -1) {
        listObjectImageInfo[index] = { ...updatedImageInfo };
    }
}
function reAddImage(listImageAdded) {
    const pdfContainer = document.getElementById('pdfContainer');
   
    // Thêm lại tất cả các ảnh từ danh sách `listObjectImageInfo`
    listImageAdded.forEach(objectImageInfo => {
        const imgElement = document.createElement('img');
        imgElement.id = objectImageInfo.item_id;
        imgElement.src = `http://127.0.0.1:8000${objectImageInfo.image}`;
        console.log(objectImageInfo.image)
        imgElement.style.position = 'absolute';
        imgElement.style.left = `${objectImageInfo.coord_in_doc_X}px`;
        imgElement.style.top = `${objectImageInfo.coord_in_doc_Y}px`;
        imgElement.style.width = `${objectImageInfo.width}px`;
        imgElement.style.height = `${objectImageInfo.height}px`;
        pdfContainer.appendChild(imgElement);
        handleImageAddedAction(imgElement.id, objectImageInfo);

        listObjectImageInfo.push(objectImageInfo);
    });
}
function handleImageAddedAction(imgElement_id,objectImageInfo) {
    const imgElement = document.getElementById(imgElement_id);
    let isDragging = false;
    let startMousePos = { x: 0, y: 0 };
    let initialPos = { left: 0, top: 0 };
    var coord_canvas_to_doc_X = 0
    var coord_canvas_to_doc_Y = 0
    imgElement.addEventListener('mousedown', function(e) {
        isDragging = true;
        startMousePos = { x: e.clientX, y: e.clientY };
        initialPos = { left: parseInt(imgElement.style.left, 10), top: parseInt(imgElement.style.top, 10) };
        var $canvasE = $(`#pdfContainer #${objectImageInfo.canvas_id}`);
        coord_canvas_to_doc_X = $canvasE.get(0).offsetLeft;
        coord_canvas_to_doc_Y = $canvasE.get(0).offsetTop;        
        console.log("toa do cua canvas so voi doc:",coord_canvas_to_doc_X,coord_canvas_to_doc_Y)
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaX = e.clientX - startMousePos.x;
            const deltaY = e.clientY - startMousePos.y;
            imgElement.style.left = (initialPos.left + deltaX) + 'px';
            imgElement.style.top = (initialPos.top + deltaY) + 'px';

            // Update image info
            objectImageInfo.coord_in_canvas_X = imgElement.offsetLeft - coord_canvas_to_doc_X;
            objectImageInfo.coord_in_canvas_Y = imgElement.offsetTop - coord_canvas_to_doc_Y;
            console.log(objectImageInfo.coord_in_canvas_X,objectImageInfo.coord_in_canvas_Y)
            objectImageInfo.coord_in_doc_X = imgElement.offsetLeft;
            objectImageInfo.coord_in_doc_Y = imgElement.offsetTop;

        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            isAddImageActive = false
            updateImageInfo(objectImageInfo);
        }
    });
}

$("#save_image").on("click", function() {
    console.log(listObjectImageInfo);

});
//lấy dữ liệu các textbox đã lưu
$(document).ready(function () {
    var tools_api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3NjkzNDU3LCJpYXQiOjE3MjI1MDk0NTcsImp0aSI6Ijk3MDg3ZGQ0ZWFiMzQ1NGRiOGMwZGRhMDYzYzQ4MWRmIiwidXNlcl9pZCI6Mn0._hZZoyZpB6RdTnubLUd0u0ZrZ44KJXVWqHY2npVooYk";
    $.ajax({
        type: "GET",
        url: `http://127.0.0.1:8000/tools/image_added_api/${file_id}/`,
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + tools_api_token
        },
        success: function (response) {
            console.log("Image api recieved:", response); 
            reAddImage(response)
        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.error('Lỗi trong yêu cầu AJAX cho PDF:', textStatus, errorThrown);
        }
    });
});
