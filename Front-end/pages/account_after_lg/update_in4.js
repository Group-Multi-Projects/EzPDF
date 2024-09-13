



function UpdateIn4() {
    
    const userIn4 = [
        {
            name: 'Luu Truong An',
            email: 'luutruongan0808@gmail.com',
            password: 'anluu'
        },
        {
            name: 'Nguyen Van B',
            email: 'nguyenvanb@gmail.com',
            password: '123456'
        }
    ]

    const [showPass, setShowPass] = React.useState(false)
    const Toggle = () =>
    {
        setShowPass(!showPass)
    }
    return(
        <div className="updateIn4">
            <div className="input-item ">
                <h6 className="input-title">Name</h6>
                <div className="input-child">
                    <input placeholder={userIn4[0].name}/>
                    <button className="btn-input">Save</button>
                </div>
            </div>
            <div className="input-item ">
                <h6 className="input-title">Email</h6>
                <div className="input-child">
                    <input placeholder={userIn4[0].email}/>
                    <button className="btn-input">Save</button>
                </div>
            </div>
            <div className="input-item ">
                <h6 className="input-title">Password</h6>
                <div className="input-child">
                    <input 
                    placeholder={userIn4[0].password}
                    type={showPass ? "text" : "password"}
                    />
                    <i
                      className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}
                      onClick={Toggle}  // Thêm sự kiện click để chuyển đổi
                      style={{ cursor: 'pointer' }}  // Thêm con trỏ chuột cho biểu tượng mắt
                     ></i>
                    <button className="btn-input">Save</button>
                </div>
            </div>
        </div>
    )
}