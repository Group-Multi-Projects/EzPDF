    var isDragging = false;
    var offsetX, offsetY;
    var isAddText = false;
    var list_textbox = []
    $("#add_text").click(function() {
        isDrawActive = false;
        isAddText = true;

        $(canvas).off('mousedown').mousedown(function(e) {
            if (isAddText) {
                let rect = canvas.getBoundingClientRect();
                var x = e.clientX;
                var y = e.clientY;
                
                addText(e, x, y);
            }
        });
        $(canvas).on('mousemove', function(event) {
            var textBox = $('<div class="textBox" contenteditable="true">Enter text here</div>');

            textBox.css({
                left: event.clientX - offsetX + 'px',
                top: event.clientY - offsetY + 'px',
                display: 'block'
            });
        });

    });

    function addText(e, x, y) {
        let textBox = $('<div class="textBox" contenteditable="true">Enter text here</div>');
        textBox.css({
            display: 'block',
            left: x + 'px',
            top: y + 'px'
        });

        $(canvas).parent().append(textBox);

        textBox.on('mousedown', function(e) {
            offsetX = e.clientX - textBox.position().left;
            offsetY = e.clientY - textBox.position().top;
            isDragging = true;

            $(canvas).on('mousemove', function(event) {
                if (isDragging) {
                    textBox.css({
                        left: event.clientX - offsetX + 'px',
                        top: event.clientY - offsetY + 'px'
                    });
                }
            });

            $(canvas).on('mouseup', function() {
                isDragging = false;
                $(canvas).off('mousemove');
            });

            e.stopPropagation();
        });

        textBox.click(function(e) {
            isAddText = false
            if (isDragging) {
                $(canvas).off('mousemove');
                isDragging = false;
            }
            e.stopPropagation();
        });
    }
    

  

    $('#save_add_text').off('click').click(function () {
    
        // let text = textBox.text();
        // let x = parseInt(textBox.css('left'));
        // let y = parseInt(textBox.css('top'));
        // let fontSize = parseInt($('#fontSize').val());
        // let fontColor = $('#fontColor').val();

        // console.log(`Text: ${text}`);
        // console.log(`Position: (${x}, ${y})`);
        // console.log(`Font Size: ${fontSize}`);
        // console.log(`Font Color: ${fontColor}`);
   });
