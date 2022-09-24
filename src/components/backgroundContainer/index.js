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


    const [activeColor, changeActiveColor] = useState({ hue: 200, sat: 100, light: 80 })
    const [allColors, setColors] = useState([])
    //const [activeTab, setActiveTab] = useState()

    const setActiveColor = (h, s, l) => {
        changeActiveColor({ hue: h, sat: s, light: l })
        let html = document.getElementById("html")
        html.style.background = `hsla(${h}, ${s}%, ${l}%, 1.0)`
    }

    const addColor = (color) => {
        let arr = allColors
        arr.push(color)
        setColors(arr)
    }

    const activateTab = (key) => {
        for(let i=0; i<allColors.length; i++){
            if(allColors[i].city === key){
                setActiveColor(allColors[i].hue, allColors[i].sat, allColors[i].light)
            }
        }
    }


    useEffect(() => {
        console.log(document.getElementById("html"))
        document.getElementById("html").style.background = `hsla(200, 100%, 80%, 1.0)`
    },[])

    return (
        <div className='bgcont' style={{ backgroundColor: `hsla(${activeColor.hue}, ${activeColor.sat}%, ${activeColor.light}%, 1.0)` }}>
            <Container className='otherContainer'>
                <div className="tab-container">
                    <DBcontext.Provider value={{ db, key }}>
                        <Dashboard setBgColor={setActiveColor} addColor={addColor} setFirstColor={setActiveColor} setActiveTab={activateTab}/>
                    </DBcontext.Provider>
                </div>
            </Container>
        </div>
    )
}

export default BackgroundContainer