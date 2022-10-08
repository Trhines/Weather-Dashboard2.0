import React from 'react'
import './index.css'
import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Dashboard from '../dashboard';

import Localbase from 'localbase'
export const DBcontext = React.createContext()
let db = new Localbase('db')
const key = "ffbfb6b231b2c20b9f38afc1cec77543"

const BackgroundContainer = (props) => {

    return (
        <div className='bgcont'>
            <Container className='otherContainer'>
                <div className="tab-container">
                    <DBcontext.Provider value={{ db, key }}>
                        <Dashboard/>
                    </DBcontext.Provider>
                </div>
            </Container>
        </div>
    )
}

export default BackgroundContainer