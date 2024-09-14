


function RightContent() {

    return(
        <div className="right-content">
            <div className="content-border">
                    <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>Word <span className="dot">(.docx)</span></span>
                        <i className="bi bi-file-earmark-word-fill" style={{ color: '#2B579A' }}></i>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>Excel <span className="dot">(.xlsx)</span></span>
                        <i className="bi bi-file-earmark-excel-fill" style={{ color: '#217346' }}></i>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>PPT <span className="dot">(.pptx)</span></span>
                        <i className="bi bi-file-earmark-ppt-fill" style={{ color: '#D24726' }}></i>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>HTML <span className="dot">(.html)</span></span>
                        <i className="bi bi-file-earmark-code-fill" style={{ color: '#E34C26' }}></i>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>JPG <span className="dot">(.jpg)</span></span>
                        <i className="bi bi-file-earmark-image-fill" style={{ color: '#4CAF50' }}></i>
                    </li>
                </ul>

                <button className="btn btn-primary mt-3 w-100" style={{ backgroundColor: '#C754A8' }}>
                    Convert
                    <i className="bi bi-arrow-right ms-2"></i>
                </button>
            </div>
        </div>
    )
}