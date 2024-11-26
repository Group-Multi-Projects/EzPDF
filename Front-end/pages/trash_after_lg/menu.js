


function Menu({index,handleRemove}) {
    
    return(
        <div className="menu">
            <ul>
                <li>Download</li>
                <li>Edit</li>
                <li onClick={() => handleRemove(index)}>Restore</li>
            </ul>
        </div>
    )
}