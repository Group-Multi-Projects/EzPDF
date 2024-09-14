document.addEventListener('DOMContentLoaded', function() {
    var sidebar = document.getElementById('sidebar');
    var showPagesBtn = document.querySelector('.btn-show-pages');
    var closeSidebarBtn = document.getElementById('closeSidebar');

    showPagesBtn.addEventListener('click', function() {
        sidebar.classList.add('active');
    });

    closeSidebarBtn.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });

    // Giả sử có sẵn danh sách các trang PDF
    let pdfPagesList = document.querySelector('.pdfPagesList');
    var totalPages = 13; // Ví dụ có 13 trang PDF
    var numpages = 0
    
    
    for (var i = 1; i <= totalPages; i++) {
        // Tạo một thẻ <li> mới
        let listItem = document.createElement('li');
        
        // Tạo div.pages-layout và div.numpage bên trong mỗi <li>
        listItem.innerHTML = `
            <div class="pages-layout"></div>
            <div class="numpage text-center">${i}</div>
        `;

        // Thêm thẻ <li> mới vào danh sách
        pdfPagesList.appendChild(listItem);
    }
});

