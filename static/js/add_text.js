    var isDragging = false;
    var offsetX, offsetY;
    var isAddText = false;
    var list_textbox = []
    var list_objectTextBox = []
    var currentIndex = -1
    $("#add_text").click(function() {
        isDrawActive = false;
        isAddText = true;
  
        $(canvas).off('mousedown').mousedown(function(e) {
            if (isAddText) {
                let x = e.clientX;
                let y = e.clientY;
                let textBoxInfo = addText(e, x, y);
                let rect = canvas.getBoundingClientRect();
                if (textBoxInfo.x === "") {
                     let textposincanvasX = e.clientX - rect.left;
                     let textposincanvasY = e.clientY - rect.top;
                     textBoxInfo.x = textposincanvasX
                     textBoxInfo.y = textposincanvasY
                }
                list_objectTextBox.push(textBoxInfo)
      
        }});
    });
    function addText(e, x, y) {
        let textBox = $('<div class="textBox" id="" contenteditable="true">Enter text here</div>');
        let objectTextBox = {
            text:"",
            x:"",
            y:"",
            fontSize:"",
            fontColor:"",
        }
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
                    let rect = canvas.getBoundingClientRect();
                    let x = offsetX - rect.left; // X tương đối với canvas
                    let y = offsetY - rect.top;
                    objectTextBox.x = x
                    objectTextBox.y = y
                    console.log(objectTextBox.x,objectTextBox.y)
                }
            });
            textBox.on('mouseup', function(e) {
                isDragging = false;
                $(canvas).off('mousemove');
                console.log("Nhac chuot")
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
        $(canvas).click(function(e) {
            objectTextBox.text = textBox.text()
        })
        textBox.attr("id",index)
        list_textbox.push(textBox)
        currentIndex += 1;
        console.log(currentIndex)
        return objectTextBox
    }
    $('#save_add_text').click(function () {
    list_textbox.forEach(element => {
        console.log(element,element.text())
    });
    });
 