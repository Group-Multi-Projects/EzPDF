
  // App.js
 function App()
 {
  
      return (
          <div className="container">
            <h3 className="title">Account</h3>
            <AvatarUploader/>
            <UpdateIn4/>
          </div>
      )
 }
const domContainer = document.querySelector('.root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App/>);