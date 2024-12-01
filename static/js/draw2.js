var listObjectDrawInfo = [];
var objectDrawInfo = {
    file_id: file_id,
    item_id: 0,
    type: "draw",
    color: "black",
    page: "",
    width: 10,
    path_coordinates: [] 
};
function setupDrawAdding(fabricCanvas, numPages) {
    $("#pen").on("click", function () {
        isDrawActive = true;
        isAddTextActive = false;
        isAddImageActive = false;
        isAddShapesActive = false;

        // Kiểm tra isDrawActive trước khi vẽ
        if (isDrawActive) {
            let path = handleCreateFreeLine(fabricCanvas, numPages);
            console.log(path);
        }
    });
}

function handleCreateFreeLine(fabricCanvas, numPages) {
    var path;
    if (isDrawActive) {
        fabricCanvas.off("mouse:up");
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.color = "red";
        fabricCanvas.freeDrawingBrush.width = 10;
        fabricCanvas.freeDrawingBrush.id = 'draw-' + Date.now();
        fabricCanvas.freeDrawingBrush.page = numPages;
    
        let drawPaths = [];
  
        fabricCanvas.on("path:created", function (event) {
            path = event.path;
            console.log("Path:",path)
            const pathCoordinates = path.path;
            drawPaths = pathCoordinates;
            path.id = fabricCanvas.freeDrawingBrush.id
            console.log("Tọa độ của nét vẽ đã lưu:", drawPaths);
    
            var objectInfo = Object.assign({}, objectDrawInfo, {
                coord_in_canvas_X: path.left,
                coord_in_canvas_Y: path.left,
                item_id: fabricCanvas.freeDrawingBrush.id,
                width: fabricCanvas.freeDrawingBrush.width,
                page: numPages,
                path_coordinates: drawPaths
            });
            if (fabricCanvas.isDrawingMode) {
                listObjectDrawInfo.push(objectInfo);
                console.log("List draw:", listObjectDrawInfo);
            }
            const queriedPath = fabricCanvas.getObjects().find(obj => obj.id === objectInfo.item_id);
            var canvasElement = fabricCanvas.getElement();
            var canvasRect = canvasElement.getBoundingClientRect();

            var drawLeftInDocument = path.left + canvasRect.left;
            var drawTopInDocument = path.top + canvasRect.top;
            console.log(canvasRect.left,canvasRect.top,path.left,path.top)
            handleCreateToolsEditDraw(fabricCanvas,path,queriedPath)
            
        });
    
        fabricCanvas.on("mouse:up", function () {
 
            fabricCanvas.isDrawingMode = false;
            disableDrawingModeForAll(fabricCanvasInstances)
            fabricCanvas.off("mouse:up");
            isDrawActive = false
            console.log("Isdrawactive",isDrawActive)
        });
        function disableDrawingModeForAll(canvases) {
            canvases.forEach(function (canvas) {
                canvas.isDrawingMode = false;
            });
        }
    }
    return path
}
function handleCreateToolsEditDraw(fabricCanvas,path,queriedPath) {
    let tools_edit_draw = $(
        `<div class="editor-toolbar" id="toolfor${fabricCanvas.freeDrawingBrush.id}">
            <button class="btn btn-outline-secondary" id="drawdelete"><i class="bi bi-trash"></i></button>
        </div>`
    );
    $("#pdfContainer").append(tools_edit_draw);
    tools_edit_draw.css(
        {
            position: 'absolute',
            display: 'none',
            left: path.left + 100 + 'px',
            top: path.top - 40 + 'px',
        }
    )
    handleFreeDrawLineEvents(fabricCanvas,queriedPath,tools_edit_draw)
}
function handleFreeDrawLineEvents(fabricCanvas,path, tools_edit_draw) {
    path.lockMovementX = true;
    path.lockMovementY = true;
    path.on("moving", function () {
        console.log(path.path);
        updatePathCoordinates(path);
        tools_edit_draw.css({
            position: 'absolute',
            display: 'block',
            left: this.left + 100 + 'px',
            top: this.top - 40 + 'px',
        });
    });
    path.on("mousedown",function () {
        tools_edit_draw.css({
            position: 'absolute',
            display: 'block',
            left: this.left + 400 + 'px',
            top: this.top - 40 + 'px',
        });
    })
    tools_edit_draw.find("#drawdelete").on("click",function () {
        tools_edit_draw.remove()
        fabricCanvas.remove(path)
        const index = listObjectDrawInfo.findIndex(objinfo => objinfo.item_id === path.id);
        if (index !== -1) {
            const item_id = listObjectDrawInfo[index].item_id; 
            listObjectDrawInfo.splice(index, 1);
            const token = document.querySelector("#user-token").textContent

            $.ajax({
                type: "DELETE",
                url: `/tools/tools_api/${item_id}/`,
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + token
                },
                success: function (response) {
                    console.log("Draw line deleted successfully");
                },
                error: function (xhr, status, error) {
                    console.log("Error deleting image:", error);
                }
            });
        }
    })
    tools_edit_draw.find("#toolsdelete").on("click",function () {
        tools_edit_draw.css({
            display:"none"
        })
    })
}
function updatePathCoordinates(path) {
    const objectInfo = listObjectDrawInfo.find(info => info.item_id === path.id);
    if (objectInfo) {
        const dx = path.left - objectInfo.coord_in_canvas_X;
        const dy = path.top - objectInfo.coord_in_canvas_Y;

        const updatedPath = path.path.map(([command, ...coords]) => {
            if (command === 'M' || command === 'L') {
                return [command, coords[0] + dx, coords[1] + dy];
            }
            return [command, ...coords];
        });
        objectInfo.path_coordinates = updatedPath;

        objectInfo.coord_in_canvas_X = path.left;
        objectInfo.coord_in_canvas_Y = path.top;

        console.log("Updated after moving:", objectInfo);
    }
}

function redraw(fabricCanvas, listObjectDrawInfo) {
    console.log(listObjectDrawInfo);
    for (let i = 0; i < listObjectDrawInfo.length; i++) {
        const objectInfo = listObjectDrawInfo[i];
        
        const path = new fabric.Path(objectInfo.path_coordinates);

        path.set({
            stroke: 'blue',
            strokeWidth: objectInfo.width,
            fill: null,
            strokeLineCap: 'round',  
            id: objectInfo.item_id
        });

        fabricCanvas.add(path);

        path.on("modified", function () {
            updatePathCoordinates(path);
        });
    }
}

$("#redraw").on("click", function () {
    redraw(fabricCanvasInstances[1]);
});
//lấy dữ liệu các textbox đã lưu
function renderDraws() {
    const token = document.querySelector("#user-token").textContent
    
    $.ajax({
        type: "GET",
        url: `/tools/draw_added_api/${file_id}/`,
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            listObjectDrawInfo = response;
            console.log("Draws added api Received response:", response); 
            for (let index = 0; index < response.length; index++) {
                const element = response[index];
                redraw(fabricCanvasInstances[element.page],response)
                let tools_edit_draw = $(
                    `<div class="editor-toolbar" id="toolfor${element.item_id}">
                        <button class="icon" id="drawdelete"><img src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png" alt="Delete"></button>
                        <button class="icon" id="toolsdelete">X</button>
                    </div>`
                );
                $("#pdfContainer").append(tools_edit_draw);
            
             
                let queriedPath = fabricCanvasInstances[element.page].getObjects().find(obj => obj.id === element.item_id);
                console.log("Query:",queriedPath)
                handleFreeDrawLineEvents(fabricCanvasInstances[element.page],queriedPath,tools_edit_draw)
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi trong yêu cầu AJAX cho PDF:', textStatus, errorThrown);
        }
    });
}
