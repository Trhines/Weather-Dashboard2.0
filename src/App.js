import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import BackgroundContainer from './components/backgroundContainer';

import React from 'react'



//api key and db reference made global through context



function App() {
  return (
      <BackgroundContainer>
        {/* <Container>
          <div className="tab-container">
            <DBcontext.Provider value={{db, key}}>
              <Dashboard/>
            </DBcontext.Provider>
          </div>
        </Container> */}
      </BackgroundContainer>
  );
}

export default App;
