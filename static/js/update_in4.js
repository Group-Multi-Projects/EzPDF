function UpdateIn4() {
    const [userInfo, setUserInfo] = React.useState({ name: '', email: '' });

    React.useEffect(() => {
        fetch('/account/get_user_info/')
            .then(response => response.json())
            .then(data => {
                setUserInfo({ name: data.username, email: data.email });
            });
    }, []);

    const [showPass, setShowPass] = React.useState(false);
    const Toggle = () => {
        setShowPass(!showPass);
    };

    return (
        <div className="updateIn4">
            <div className="input-item ">
                <h6 className="input-title">Name</h6>
                <div className="input-child">
                    <input placeholder={userInfo.name} />
                    <button className="btn-input">Save</button>
                </div>
            </div>
            <div className="input-item ">
                <h6 className="input-title">Email</h6>
                <div className="input-child">
                    <input placeholder={userInfo.email} />
                    <button className="btn-input">Save</button>
                </div>
            </div>
            <div className="input-item ">
                <h6 className="input-title">Password</h6>
                <div className="input-child">
                    <input
                        placeholder="Enter your password"
                        type={showPass ? "text" : "password"}
                    />
                    <i
                      className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}
                      onClick={Toggle}  
                      style={{ cursor: 'pointer' }}  
                    ></i>
                    <button className="btn-input">Save</button>
                </div>
            </div>
        </div>
    );
}
