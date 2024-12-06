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

// Reducer function
const reducer = (state, action) => {
    switch (action.type) {
        case ADD_FILE:
            console.log(state)
            console.log(action.payload)
            return {
                ...state,
           
                listFiles: [action.payload, ...state.listFiles]
            };
        case DELETE_FILE:

            console.log(action.payload);
            console.log("Trước",state.listFiles[0])

            state.listFiles[0] = state.listFiles[0].filter((_, index) => index !== action.payload);
            console.log("Sau",state.listFiles[0])
            return {
                listFiles: state.listFiles.filter((_, index) => index !== action.payload),       
                ...state,
            };
        default:
            throw new Error("Invalid action.");
    }
};
function Content() {
    console.log("Init state:",initState)
    const [state, dispatch] = React.useReducer(reducer, initState);
    const listFiles = state.listFiles;
    console.log("44",state)
    const [showPass, setShowPass] = React.useState(false);
    const [showMenu, setShowMenu] = React.useState(null);
    // Fetch list of files on component mount
    React.useEffect(() => {
        const page_type = document.querySelector("#page_type").textContent

        // const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
        const token = document.querySelector("#user-token").textContent
        fetch(`/get_list_files/${page_type}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("59:",data.list_files)
            dispatch({ type: ADD_FILE, payload: data.list_files });
        })
        .catch(error => {
            console.error('Error fetching files:', error);
        });
    }, []);
    const Toggle = () => {
        setShowPass(!showPass);
    };
    const handleClick = (id) => {
        setShowMenu((prevId) => (prevId === id ? null : id));
    };
    const handleUpload = (event) => {
        const newFile = event.target.files[0];
        if (newFile) {
            let fileName = newFile.name;
            if (fileName.length > 30) {
                const ext = fileName.slice(fileName.lastIndexOf('.'));
                fileName = `${fileName.slice(0, 20)}...${ext}`;
            }
            const fileType = newFile.name.split('.').pop().toLowerCase();
            let preview;
            
            if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
                preview = URL.createObjectURL(newFile);
            } else {
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
                        preview = 'path-to-default-file-icon.png';
                }
            }
            const fileObject = {
                file: fileName,
                preview: preview
            };
            dispatch(addFile(fileObject));
        }
    };
   
    
    const handleDelete = (index,file_id) => {
        console.log("Click xoa")
        dispatch(deleteFile(index));  

        $.ajax({
            type: "POST",
            url: `/trash/${file_id}/`,
            headers: {
                "X-CSRFToken": getCookie('csrftoken'), // CSRF token if necessary
                // Uncomment and set the Authorization header if you're using token authentication
                // "Authorization": "Bearer " + token
            },
            success: function (response) {
                $(`#pdf-item-${file_id}`).remove()
                console.log("Xoá thành công");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Lỗi trong yêu cầu AJAX cho PDF:', textStatus, errorThrown);
            }
        });
        
        // Function to get the CSRF token from cookies
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    // Check if this cookie string begins with the name we want
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        
    };
    const files = listFiles.flat();
    function get_preview(fileName) {
        if (fileName.length > 30) {
            const ext = fileName.slice(fileName.lastIndexOf('.'));
            fileName = `${fileName.slice(0, 20)}...${ext}`;
        }

        const fileType = fileName.split('.').pop().toLowerCase();
        let preview;
        
        if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
            preview = URL.createObjectURL(fileName);
        } else {
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
                    preview = 'path-to-default-file-icon.png';
            }
        }
        return preview
    }
    files.forEach(element => {
        if (element.file.includes('/media/files/')) {
            element.file = element.file.replace('/media/files/', '');
        }
        let preview = get_preview(element.file)
        element.preview = preview
        
    });

//     <div className="btn-add">
//     <i className="bi bi-plus-lg"></i>
//     <label className="btn-add-label" htmlFor="upload">Add</label>
//     <input
//         type="file"
//         id="upload"
//         style={{ display: 'none' }}
//         onChange={handleUpload}
//     />
// </div>

    return (
<div className="content">
        
    <table>
        <thead>
            <tr>
                <th>Preview</th>
                <th>Name</th>
                <th>Set</th>
            </tr>
        </thead>
        <tbody>
            {files.map((file, index) => (
                <tr id={`tr-${index}`} key={index}>
                    <td>
                        <img
                            src={file.preview}
                            alt={file.file}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '10px',
                                objectFit: 'cover'
                            }}
                        />
                    </td>
                    <td>
                        <a href={`/edit/${file.id}/`}
                           style={{ textDecoration: 'none', color: 'black' }}
                        >
                            {file.file}   
                        </a>
                    </td>
                    <td>
                        <i
                            className="bi bi-three-dots-vertical"
                            onClick={() => handleClick(index)}
                        ></i>
                        {showMenu === index && (
                            <div>
                                {/* Render Menu component within a valid container */}
                                <Menu index={index} file_id={file.id} handleRemove={handleDelete}/>
                            </div>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

    );
}

