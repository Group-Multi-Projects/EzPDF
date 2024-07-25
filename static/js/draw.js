$(document).ready(function() {
    var canvas = $('#pdfCanvas')[0];
    var ctx = canvas.getContext('2d');
    var isDrawing = false;
    var pdfDocument = null;
    var currentPage = 1;
    var drawingPoints = [];

    // Load PDF
    $('#fileInput').on('change', function(event) {
        var file = event.target.files[0];
        var fileReader = new FileReader();
        fileReader.onload = function() {
            var typedArray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
                pdfDocument = pdf;
                renderPage(currentPage);
            });
        };
        fileReader.readAsArrayBuffer(file);
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