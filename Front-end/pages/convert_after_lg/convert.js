  
  
  // App.js
  function App()
  {

       return (
           <div className="container">
                <h1>Conversion</h1>
                <Content/>
           </div>
       )
  }
 const domContainer = document.querySelector('.root');
 const root = ReactDOM.createRoot(domContainer);
 root.render(<App/>);