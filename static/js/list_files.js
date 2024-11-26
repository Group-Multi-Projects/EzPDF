document.addEventListener('DOMContentLoaded', function() {
    const fileElements = document.querySelectorAll('.pdf-item');

    fileElements.forEach(item => {
        const canvasId = item.querySelector('canvas').id;
        const fileUrl = item.querySelector('p').textContent; 

        pdfjsLib.getDocument(fileUrl).promise.then(pdf => {
            pdf.getPage(1).then(page => {
                const canvas = document.getElementById(canvasId);
                const context = canvas.getContext('2d');

                const viewport = page.getViewport({ scale: 1.5 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        }).catch(error => {
            console.error('Lỗi khi tải PDF:', error);
        });
    });
});
