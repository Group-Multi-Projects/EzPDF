$(document).ready(function() {
    var canvas = $('#pdfCanvas')[0];
    var ctx = canvas.getContext('2d');
    var isDrawing = false;
    var pdfDocument = null;
    var currentPage = 1;
    var drawingPoints = [];
    var file_id = $("#file_id").text()
    var file_path = $("#file_path").text()

    var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3MTY0OTM1LCJpYXQiOjE3MjE5ODA5MzUsImp0aSI6IjdhMjcyMGRjN2Y4OTRlZTdhOGE4MDYzYzA0OTIxNWRiIiwidXNlcl9pZCI6MX0.E004KL8pztdtBk7vvEq2azDytMFl4ryXI-kcRWxcjU8"
    // var access_token = $("#access_token").text()
    // console.log(access_token)
    // $.ajax({
    //     type: "GET",
    //     url: `http://127.0.0.1:8000/file_api/${file_id}/`,
    //     headers: {
    //         "Authorization": "Bearer " + token
    //     },
    //     success: function (response) {
    //         console.log('Response received:', response);
    //         var fileUrl = response.file; 
    //         $.ajax({
    //             type: "GET",
    //             url: fileUrl,
    //             xhrFields: {
    //                 responseType: 'arraybuffer'
    //             },
    //             success: function (pdfResponse) {
    //                 var typedArray = new Uint8Array(pdfResponse);
    //                 pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
    //                     pdfDocument = pdf;
    //                     renderPage(currentPage);
    //                 }).catch(function(error) {
    //                     console.error('Error loading PDF:', error);
    //                 });
    //             },
    //             error: function (jqXHR, textStatus, errorThrown) {
    //                 console.error('Error during AJAX request for PDF:', textStatus, errorThrown);
    //             }
    //         });
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //         console.error('Error during initial AJAX request:', textStatus, errorThrown);
    //     }
    // });
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
                renderPage(currentPage);
            }).catch(function(error) {
                console.error('Error loading PDF:', error);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error during AJAX request for PDF:', textStatus, errorThrown);
        }
    });
    // Render Page
    function renderPage(num) {
        pdfDocument.getPage(num).then(function(page) {
            var viewport = page.getViewport({ scale: 1 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            console.log(page)
            page.render(renderContext).promise.then(function() {
                // Redraw saved drawings after rendering page
                redraw();
            });
        });
    }

    // Event listeners for drawing
    $(canvas).on('mousedown', function(e) {
        isDrawing = true;
        draw(e); // Draw immediately when mouse is pressed
    });

    $(canvas).on('mousemove', draw);

    $(canvas).on('mouseup', function() {
        isDrawing = false;
        ctx.beginPath(); // End drawing when mouse is released
        drawingPoints.push(null);
        
    });

    // Drawing function
    function draw(e) {
        if (!isDrawing || !pdfDocument) return;

        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black'; 

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath(); 
        ctx.moveTo(x, y);

        drawingPoints.push({ x: x, y: y });

    }

    // Redraw saved drawings
    function redraw() {
        if (!drawingPoints.length) return;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'red';
    
        ctx.beginPath();
    
        for (var i = 0; i < drawingPoints.length; i++) {
            if (drawingPoints[i] === null) {
                ctx.stroke();
                ctx.beginPath();
            } else {
                if (i === 0 || drawingPoints[i - 1] === null) {
                    ctx.moveTo(drawingPoints[i].x, drawingPoints[i].y);
                } else {
                    ctx.lineTo(drawingPoints[i].x, drawingPoints[i].y);
                }
            }
        }
        ctx.stroke();
    }
    
    // Save drawing button
    $('#saveDrawing').on('click', function() {
        console.log(JSON.stringify(drawingPoints));
        console.log()
    });

    // Redraw button
    $('#redraw').on('click', function() {
        redraw();
    });

});