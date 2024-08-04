var pdfDocument = null;
var file_path = $("#file_path").text();
var file_id = $("#file_id").text();
var penBtn = $("#pen");
var index = -1
// var priority = 0
var currentIndexAddText = -1
var objAllChangesEvent = {
    file_id:0,
    draw:[],
    addtext:[],
    addimage:[]
}

$.ajax({
    type: "GET",
    url: `http://127.0.0.1:8000/media/${file_path}`,
    xhrFields: {
        responseType: 'arraybuffer'
    },
    success: function (pdfResponse) {
        var typedArray = new Uint8Array(pdfResponse);
        pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
            pdfDocument = pdf;
            renderAllPages();
        }).catch(function(error) {
            console.error('Lỗi tải PDF:', error);
        });
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.error('Lỗi trong yêu cầu AJAX cho PDF:', textStatus, errorThrown);
    }
});

function renderAllPages() {

    for (var num = 1; num <= pdfDocument.numPages; num++) {
        renderPage(num);
    }

}

function renderPage(num) {
    pdfDocument.getPage(num).then(function(page) {
        var viewport = page.getViewport({ scale: 1 });
        var canvas = document.createElement('canvas');
        canvas.className = 'pdfCanvas';
        canvas.id = num;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        var ctx = canvas.getContext('2d');
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderContext).promise.then(function() {
            $('#pdfContainer').append(canvas);
        });
        var isDrawActive = false;
        var isAddTextActive = false;
        var isAddImgaeActive = false
        var isAddShapesActive = false
        setupTextAdding(canvas);
        drawing(canvas, ctx);
        setupImageAdding(canvas)
        setupShapesAdding(canvas)

    });
}

$("#save_all_changes").click(function (e) { 
    console.log("Danh sách các đường vẽ:", listObjectDrawInfo);
    console.log("Danh sách các textbox:", listObjectTextBoxInfo);
    console.log("Danh sách các image thêm:",listObjectImageInfo);
    objAllChangesEvent.draw = listObjectDrawInfo;
    objAllChangesEvent.addtext = listObjectTextBoxInfo;
    objAllChangesEvent.addimage = listObjectImageInfo
    objAllChangesEvent.file_id = file_id; // Thêm file_id vào đối tượng

    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/tools/getalldatas/",
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
