



function LeftContent() {
    return(
        <div className="left-content">
            <div className="content-border">
                <div className="file-preview mb-2">
                    {/* Placeholder for the file preview (image or icon) */}
                </div>
                <div className="file-info text-center">
                    <p>Tên file</p>
                    <a className="btn btn-light"
                        href="../upLoadPage_after.html"
                    >
                    <i className="bi bi-trash"></i> Hủy
                    </a>
                </div>
            </div>
        </div>
    )
    
}