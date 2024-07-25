$(document).ready(function() {
    var canvas = $('#pdfCanvas')[0];
    var ctx = canvas.getContext('2d');
    var isDrawing = false;
    var pdfDocument = null;
    var currentPage = 1;
    var drawingPoints = [];
    var file_id = $("#file_id").text()
    var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIxOTQ5ODQ5LCJpYXQiOjE3MjE5NDYyNDksImp0aSI6ImE2YmYzNjAyMTIyMzQxZjI5MzFhOTQzNzYwZTI2NGJlIiwidXNlcl9pZCI6MX0.lhmprXc3XWO3afj7CDcC9GJUH4GjYUu5CVrsXQEi_rM"
    $.ajax({
        type: "GET",
        url: `http://127.0.0.1:8000/file_api/${file_id}/`,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            console.log('Response received:', response);
            var fileUrl = response.file; 
            $.ajax({
                type: "GET",
                url: fileUrl,
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
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error during initial AJAX request:', textStatus, errorThrown);
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