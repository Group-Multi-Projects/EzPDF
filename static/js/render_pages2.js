var pdfDocument = null;
var file_path = $("#file_path").text();
var file_id = $("#file_id").text();
var penBtn = $("#pen");
var index = -1;
var numPages = $("#num_pages").text();
var currentIndexAddText = -1;
var objAllChangesEvent = {
    file_id: 0,
    draw: [],
    addtext: [],
    addimage: [],
    addshape: [],
};
var edits = {};
let fabricCanvasInstances = [];
var objAllChangesEvent = {
    file_id:0,
    draw:[],
    addtext:[],
    addimage:[],
    addshape:[],
}

// function start_loading_page() {} here
// function end_loading_page() {} here
$.ajax({
    type: "GET",
    url: `/media/${file_path}`,
    xhrFields: {
        responseType: 'arraybuffer'
    },
    success: function (pdfResponse) {
        var typedArray = new Uint8Array(pdfResponse);
        // start_loading_page()
        pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
            pdfDocument = pdf;
            renderAllPages();

        }).catch(function (error) {
            console.error('Lỗi tải PDF:', error);
        });
        // end_loading_page()
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.error('Lỗi trong yêu cầu AJAX cho PDF:', textStatus, errorThrown);
    }
});
function renderAllPages() {
    renderPage(1); // Start rendering from the first page
}
function renderPage(num) {
    pdfDocument.getPage(num).then(function(page) {
        var viewport = page.getViewport({ scale: 1 });

        // Create container div
        var divCanvas = document.createElement('div');
        divCanvas.className = 'all-canvas'
        divCanvas.style.marginBottom = '20px'
        // Create and append PDF canvas
        var pdfCanvas = document.createElement('canvas');
        pdfCanvas.className = 'pdfCanvas';
        pdfCanvas.id = 'pdfCanvas' + num;
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        pdfCanvas.style.border = '0.5px solid #949494'; 
        divCanvas.appendChild(pdfCanvas);

        // Create and append Fabric.js canvas
        let fabricCanvas = document.createElement('canvas');
        fabricCanvas.className = 'fabric-canvas';
        fabricCanvas.width = viewport.width;
        fabricCanvas.height = viewport.height;
        divCanvas.appendChild(fabricCanvas);

        // Append container div to the main container
        $('#pdfContainer').append(divCanvas);
        $('#pdfContainer').css({
            position:'relative'
        })
        divCanvas.style.position = 'relative'
        // Position canvases absolutely within the container
        pdfCanvas.style.position = 'absolute';
        fabricCanvas.style.position = 'absolute';
        pdfCanvas.style.top = '0';
        pdfCanvas.style.left = '0';
        fabricCanvas.style.top = '0';
        fabricCanvas.style.left = '0';
        let priotity = 0;
        let pdfContext = pdfCanvas.getContext('2d');
        let renderContext = {
            canvasContext: pdfContext,
            viewport: viewport
        };

        page.render(renderContext).promise.then(function() {
            console.log('Page rendered:', num);
            if (num <= pdfDocument.numPages) {
                let fabricCanvasInstance = new fabric.Canvas(fabricCanvas);
                fabricCanvasInstances[num] = fabricCanvasInstance
                console.log('Fabric canvas created for page:', num);
         
                setupTextAdding(fabricCanvasInstance,num);
                setupImageAdding(fabricCanvasInstance,num);
                setupShapesAdding(fabricCanvasInstance,num);
                setupDrawAdding(fabricCanvasInstance,num);
                renderPage(num + 1); // Render next page
            }
            if (num === pdfDocument.numPages) {
                renderText()
                renderImage()
                renderShapes()
                renderDraws()
            }
        }).catch(function(error) {
            console.error('Error rendering page:', num, error);
        });
    }).catch(function(error) {
        console.error('Error displaying page:', num, error);
    });
}
$("#save_all_changes").click(function (e) { 
    console.log("Danh sách các đường vẽ:", listObjectDrawInfo);
    console.log("Danh sách các textbox:", listObjectTextBoxInfo);
    console.log("Danh sách các image thêm:",listObjectImageInfo);
    console.log("Danh sách các shape thêm:",listObjectShapesInfo);
    objAllChangesEvent.draw = listObjectDrawInfo;
    objAllChangesEvent.addtext = listObjectTextBoxInfo;
    objAllChangesEvent.addimage = listObjectImageInfo
    objAllChangesEvent.addshape = listObjectShapesInfo
    objAllChangesEvent.file_id = file_id; // Thêm file_id vào đối tượng
    $.ajax({
        type: "POST",
        url: "/tools/getalldatas/",
        data: JSON.stringify(objAllChangesEvent),
        contentType: "application/json",
        headers: {
            "X-CSRFToken": getCookie('csrftoken') // Hàm để lấy CSRF token
        },
        success: function(response) {
            console.log("Response from server:", response);
            alert(response.message);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Lỗi gửi dữ liệu:', textStatus, errorThrown);
        }
    });
});
// Hàm để lấy CSRF token từ cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Kiểm tra nếu cookie bắt đầu với tên được cung cấp
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
