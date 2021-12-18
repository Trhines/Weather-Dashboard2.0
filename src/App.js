import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container'
import Dashboard from './components/dashboard';

import React from 'react'

import Localbase from 'localbase'

export const DBcontext = React.createContext()

//api key and db reference made global through context

let db = new Localbase('db')
const key = "ffbfb6b231b2c20b9f38afc1cec77543"

function App() {
  return (
    <Container>
      <div className="tab-container">
        <DBcontext.Provider value={{db, key}}>
          <Dashboard/>
        </DBcontext.Provider>
      </div>
    </Container>
  );
}

export default App;
