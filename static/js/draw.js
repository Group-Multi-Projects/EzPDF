    var penBtn = $("#pen")
    var isDrawing = false;
    var drawingPoints = [];
    var isDrawActive = false
    var restoreArray = []
    let index = -1
    penBtn.on("click", function () {
        isDrawActive = true
        isAddText = false
        restoreArray.push(ctx.getImageData(0,0,canvas.width,canvas.height))
        index += 1
        $(canvas).on('mousedown', function(e) {
            let rect = canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
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
            restoreArray.push(ctx.getImageData(0,0,canvas.width,canvas.height))
            index += 1
            console.log(restoreArray)
        });
    });
    // Drawing function
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

    // Redraw saved drawings
    function redraw() {
        if (!drawingPoints.length) return;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'red';
    
        ctx.beginPath();
    
        for (let i = 0; i < drawingPoints.length; i++) {
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
