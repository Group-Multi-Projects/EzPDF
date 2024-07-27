    var penBtn = $("#pen")
    var isDrawing = false;
    var drawingPoints = [];
    var isDrawActive = false
 
    penBtn.on("click", function () {
        isDrawActive = true
        isAddText = false
        $(canvas).on('mousedown', function(e) {
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            console.log("Pen:",rect)
            console.log("x:",x)
            console.log("y:",y)
            isDrawing = true;
            draw(e); 
        });
        $(canvas).on('mousemove', draw);
        $(canvas).on('mouseup', function() {
            isDrawing = false;
            ctx.beginPath(); 
            drawingPoints.push(null);
            
        });
    });
    // Drawing function
    function draw(e) {
        if (isDrawActive) {
            
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

