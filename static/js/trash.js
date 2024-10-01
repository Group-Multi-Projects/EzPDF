  // App.js
  function App()
  {

       return (
           <div className="projects-container">
             <div className="slider">
                <h1>Trash</h1>
             </div>
             <Content/>
           
           </div>
       )
  }
 const domContainer = document.querySelector('.root');
 const root = ReactDOM.createRoot(domContainer);
 root.render(<App/>);