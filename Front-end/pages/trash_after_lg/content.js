const initState = {
    listFiles: []
};

// Actions
const ADD_FILE = 'add';
const DELETE_FILE = 'delete';

const addFile = (payload) => ({
    type: ADD_FILE,
    payload
});

const deleteFile = (payload) => ({
    type: DELETE_FILE,
    payload
});

// Reducer
const reducer = (state, action) => {
    switch (action.type) {
        case ADD_FILE:
            return {
                ...state,
                listFiles: [action.payload, ...state.listFiles]
            };
        case DELETE_FILE:
            const newList = [...state.listFiles];
            newList.splice(action.payload, 1);
            return {
                ...state,
                listFiles: newList
            };
        default:
            throw new Error("Invalid action.");
    }
};

function Content() {
    // Dispatch
    const [set, dispatch] = React.useReducer(reducer, initState);
    const { listFiles } = set;

    const [showMenu, setShowMenu] = React.useState(null);

    const handleClick = (id) => {
        setShowMenu((prevId) => (prevId === id ? null : id));
    };

    const handleUpload = (event) => {
        const newFile = event.target.files[0];
        if (newFile) {
            // Truncate file name if longer than 30 characters
            let fileName = newFile.name;
            if (fileName.length > 30) {
                const ext = fileName.slice(fileName.lastIndexOf('.'));
                fileName = `${fileName.slice(0, 20)}...${ext}`;
            }

            // Determine file type and assign appropriate icon or preview
            const fileType = newFile.name.split('.').pop().toLowerCase();
            let preview;
            
            if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
                // If the file is an image, display its preview
                preview = URL.createObjectURL(newFile);
            } else {
                // Assign an icon based on file type
                switch (fileType) {
                    case 'html':
                        preview = 'https://cdn-icons-png.flaticon.com/128/186/186320.png';
                        break;
                    case 'docx':
                        preview = 'https://cdn-icons-png.flaticon.com/128/716/716935.png';
                        break;
                    case 'pdf':
                        preview = 'https://cdn-icons-png.flaticon.com/128/337/337946.png';
                        break;
                    case 'xlsx':
                    case 'xls':
                        preview = 'https://cdn-icons-png.flaticon.com/128/9704/9704734.png';
                        break;
                    case 'pptx':
                    case 'ppt':
                        preview = 'https://cdn-icons-png.flaticon.com/128/337/337949.png';
                        break;
                    case 'svg':
                        preview = 'https://cdn-icons-png.flaticon.com/128/337/337954.png';
                        break;    
                    default:
                        preview = 'path-to-default-file-icon.png'; // Default icon for unsupported files
                }
            }

            // Create an object that contains the file name and preview (icon or image)
            const fileObject = {
                name: fileName,
                preview: preview
            };

            dispatch(addFile(fileObject)); // Add the file object to the state
        }
    };

    const handleDelete = (index) => {
        dispatch(deleteFile(index));
    };

    return (
        <div className="content">
            <div className="btn-add">
                <i className="bi bi-plus-lg"></i>
                <label
                    className="btn-add-label"
                    htmlFor="upload"
                >Add</label>
                <input
                    type="file"
                    id="upload"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Preview</th>
                        <th>Name</th>
                        <th>Set</th>
                    </tr>
                </thead>
                <tbody>
                    {listFiles.map((file, index) => (
                        <tr key={index}>
                            <td>
                                {/* Displaying image preview or file type icon */}
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '10px',
                                        objectFit: 'cover'
                                    }}
                                />
                            </td>
                            <td>{file.name}</td>
                            <td>
                                <i
                                    className="bi bi-three-dots-vertical"
                                    onClick={() => handleClick(index)}
                                ></i>
                            </td>
                            {showMenu === index && <Menu index={index} handleRemove={handleDelete} />}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
