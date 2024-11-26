


function Menu({index,handleRemove}) {
    
    return(
        <div className="menu">
            <ul>
                <li>Download</li>
                <li>Edit</li>
                <li onClick={() => handleRemove(index)}>Move into trash</li>
            </ul>
        </div>
    )
}