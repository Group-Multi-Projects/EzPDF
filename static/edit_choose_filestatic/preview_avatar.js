

function AvatarUploader() {
    const [avatar, setAvatar] = React.useState(null);
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        file.preview = URL.createObjectURL(file);
        setAvatar(file);
      }
    };
  
    React.useEffect(() => {
      // Cleanup URL preview khi component unmount hoặc ảnh mới được chọn
      return () => {
        if (avatar) {
          URL.revokeObjectURL(avatar.preview);
        }
      };
    }, [avatar]);
  
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '20px 0',
                      display: 'flex',
                      justifyContent: 'center'  
         }}>
          <div className="avatar" style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: '#8BEB6C', // Màu nền xanh
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#fff',
          }}>
            {avatar ? 
            <img src={avatar.preview} alt="Avatar Preview" 
            style={{ width: '100%', 
                    height: '100%', 
                    borderRadius: '50%' }} 
            /> : 'AL'}
          </div>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }} // Ẩn input mặc định
        />
        <label htmlFor="file-upload" style={{
          border: '1px solid #ccc',
          padding: '5px 10px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Change your Avatar
        </label>
      </div>
    );
  }
