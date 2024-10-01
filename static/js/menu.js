


function Menu({index,file_id,handleRemove}) {
    
    return(
        <div className="menu">
            <ul>
                <li>Download</li>
                <li>Edit</li>
                <li onClick={() => handleRemove(index,file_id)}>Move into trash</li>
            </ul>
        </div>
    )
}