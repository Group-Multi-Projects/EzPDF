function clear_canvas() {
    // ctx.fillStyle = "white"
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillRect(0,0,canvas.width,canvas.height)
    restoreArray = []
    index = -1
}
function undo_canvas() {
    if (index <=0 ) {
        clear_canvas()
    } else {
        index -= 1;
        restoreArray.pop()
        ctx.putImageData(restoreArray[index],0,0)
    }
}
// Biến toàn cục để theo dõi chỉ số phần tử hiện tại

function undo_html() {
    // Kiểm tra nếu danh sách không rỗng và currentIndex hợp lệ
    if (currentIndex >= 0) {
        // Lấy phần tử hiện tại dựa trên currentIndex
        let element = list_textbox[currentIndex];
        
        // Ẩn phần tử hiện tại
        $(element).css("display", "none");
        
        // Giảm currentIndex để chuyển đến phần tử tiếp theo
        currentIndex--;
    } else {
        console.log("Đã ẩn tất cả các phần tử.");
    }
}

