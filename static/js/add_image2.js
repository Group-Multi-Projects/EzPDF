var listObjectImageInfo = [];
var isAddImageActive = false;
var objectImageInfo = {
    file_id: file_id,
    image: "",
    item_id: "",
    type: "addimage",
    coord_in_canvas_X: 0,
    coord_in_canvas_Y: 0,
    height: 200,
    width: 200,
    page: 0
};

function setupImageAdding(fabricCanvas, numPages) {
    var imageInput = document.getElementById('add_image');

    imageInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            // Reset states
            isDrawActive = false;
            isAddTextActive = false;
            isAddShapesActive = false;
            isAddImageActive = true;
            
            fabricCanvas.on('mouse:down', function(event) {
                if (isAddImageActive) {
                    readerFile(fabricCanvas, e, event, numPages).then(function(objInfo) {
                        fabricCanvas.on('mouse:up', function() {
                            if (objInfo) {
                                listObjectImageInfo.push(objInfo); 
                                isAddImageActive = false;
                                fabricCanvas.off('mouse:up');
                            }
                        });
                    });
                    isAddImageActive = false;
                }
            }); 
        }
    });
}
function readerFile(fabricCanvas, e, mouseEvent, numPages) {
    return new Promise(function(resolve) {
        if (isAddImageActive) {
            var reader = new FileReader();

            reader.onload = function(event) {
                var imgObj = new Image();
                imgObj.src = event.target.result;
                imgObj.onload = function () {
                    var objInfo = handleCreateFabricImage(fabricCanvas, imgObj, mouseEvent, numPages);
                    resolve(objInfo);
                };
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            resolve(null);
        }
    });
}
function handleCreateFabricImage(fabricCanvas, imgObj, mouseEvent, numPages) {
    var img = new fabric.Image(imgObj);
    img.scale(0.5);
    
    var pointer = fabricCanvas.getPointer(mouseEvent.e);
    var item_id = 'image-' + Date.now();

    img.set({
        left: pointer.x,
        top: pointer.y,
        id: item_id
    });
    
    fabricCanvas.add(img);
    let tools_box = handleCreateBoxToolsEditImage(img,fabricCanvas)

    handleMouseImageEvents(img,tools_box,fabricCanvas)
    // Cập nhật thông tin hình ảnh
    var objectInfo = {
        file_id: file_id,
        image: imgObj.src,
        item_id: img.id,
        type: "addimage",
        coord_in_canvas_X: img.left,
        coord_in_canvas_Y: img.top,
        height: img.height,
        width: img.width,
        page: numPages
    };

    return objectInfo;
}
function getImagePositionRelativeToDocument(img, fabricCanvas) {
    var imgLeft = img.left;
    var imgTop = img.top;

    var canvasElement = fabricCanvas.getElement();
    var canvasRect = canvasElement.getBoundingClientRect();

    var imgLeftInDocument = imgLeft + canvasRect.left;
    var imgTopInDocument = imgTop + canvasRect.top;

    return {
        left: imgLeftInDocument,
        top: imgTopInDocument
    };
}
function handleCreateBoxToolsEditImage(img,fabricCanvas) {
    var position = getImagePositionRelativeToDocument(img, fabricCanvas);
    let tools_edit_image = $(
        `<div class="editor-toolbar" id="toolfor${img.id}">
            <button class="icon" id="imagedelete"><img src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png" alt="Delete"></button>
        </div>`
    );
    tools_edit_image.css({
        position: 'absolute',
        display: 'block',
        left: position.left + (img.width / 2) - (tools_edit_image.outerWidth() / 2) + 'px',
        top: position.top - tools_edit_image.outerHeight() - 250 + 'px', // cách phía trên một khoảng 10px
    })
    $("#pdfContainer").append(tools_edit_image);
    tools_edit_image.find("#imagedelete").on("click", function () {
        fabricCanvas.remove(img);
        tools_edit_image.remove();
    
        const index = listObjectImageInfo.findIndex(objinfo => objinfo.item_id === img.id);
        if (index !== -1) {
            const item_id = listObjectImageInfo[index].item_id; 
            listObjectImageInfo.splice(index, 1);
            const token = document.querySelector("#user-token").textContent

            $.ajax({
                type: "DELETE",
                url: `/tools/tools_api/${item_id}/`,
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + token
                },
                success: function (response) {
                    console.log("Image deleted successfully");
                },
                error: function (xhr, status, error) {
                    console.log("Error deleting image:", error);
                }
            });
        }
        

      
    });
    
    return tools_edit_image

}
function handleMouseImageEvents(img,tools_box,fabricCanvas) {
    // Lắng nghe sự kiện khi hình ảnh được kéo thả
    img.on('moving', function() {
        updateImageInfo(img);
        let position = getImagePositionRelativeToDocument(img, fabricCanvas);
        tools_box.css({
            position: 'absolute',
            display: 'block',
            left: position.left + (img.width / 2) - (tools_box.outerWidth() / 2) + 'px',
            top: position.top - tools_box.outerHeight() - 250 + 'px', // cách phía trên một khoảng 10px
        })
    });

    // Lắng nghe sự kiện khi hình ảnh được thay đổi kích thước
    img.on('scaling', function() {
        updateImageInfo(img);
        let position = getImagePositionRelativeToDocument(img, fabricCanvas);

        tools_box.css({
            position: 'absolute',
            display: 'block',
            left: position.left + (img.width / 2) - (tools_box.outerWidth() / 2) + 'px',
            top: position.top - tools_box.outerHeight() - 250 + 'px', // cách phía trên một khoảng 10px
        })
  
    });

    // Lắng nghe sự kiện khi hình ảnh được xoay (nếu cần)
    img.on('rotating', function() {
        updateImageInfo(img);
    });
}
function updateImageInfo(img) {
    // Tìm đối tượng trong listObjectImageInfo theo item_id
    var item_id = img.get('id');
    var objectInfo = listObjectImageInfo.find(function(info) {
        return info.item_id === item_id;
    });

    if (objectInfo) {
        // Cập nhật thông tin đối tượng với các giá trị mới
        objectInfo.coord_in_canvas_X = img.left;
        objectInfo.coord_in_canvas_Y = img.top;
        objectInfo.width = img.width * img.scaleX; // Cập nhật với scale mới
        objectInfo.height = img.height * img.scaleY; // Cập nhật với scale mới
        objectInfo.angle = img.angle; // Cập nhật góc xoay (nếu cần)
    }
}
function reAddImage(listObjectImageInfo) {
    listObjectImageInfo.forEach(element => {
        // Create an Image object
        var imgObj = new Image();
        imgObj.src = element.image;

        imgObj.onload = function() {
            // Create a Fabric.js image object
            var img = new fabric.Image(imgObj, {
                left: element.coord_in_canvas_X,
                top: element.coord_in_canvas_Y,
                scaleX: element.width / imgObj.width,
                scaleY: element.height / imgObj.height,
                id: element.item_id,
                angle: element.angle || 0  // Set the angle if it exists, otherwise default to 0
            });

            // Add the image to the canvas
            let fabricCanvas = fabricCanvasInstances[element.page]
            fabricCanvas.add(img);

            // Re-create the tool box for editing the image
            let tools_box = handleCreateBoxToolsEditImage(img, fabricCanvas);

            // Re-bind the mouse events to the image
            handleMouseImageEvents(img, tools_box, fabricCanvas);
        };
    });
}
$("#save_image").click(function () {
    console.log(listObjectImageInfo);
});
function renderImage() {
    $(document).ready(function () {
        const token = document.querySelector("#user-token").textContent
        $.ajax({
            type: "GET",
            url: `/tools/image_added_api/${file_id}/`,
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (response) {
                console.log("Image api recieved:", response); 
                listObjectImageInfo = response
                reAddImage(listObjectImageInfo)
            },
            error: function (jqXHR, textStatus, errorThrown) {
    
                console.error('Lỗi trong yêu cầu AJAX cho PDF:', textStatus, errorThrown);
            }
        });
    });
}
