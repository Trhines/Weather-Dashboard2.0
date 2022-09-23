import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import SearchBar from "../searchBar"
import Results from "../searchResult"

import { deleteLocationData, deleteWeatherData } from '../../utils/indexdb'

import { DBcontext } from '../backgroundContainer'
import { useState, useEffect } from 'react'
import React from 'react'
import { getAllLocationData } from '../../utils/indexdb'
// import { getWeatherData } from '../../utils/api/weatherApi'

import SearchModal from "../search modal"
import WeatherTab from '../weatherTab'

import './index.css'

//should return all tabs made based off of indexDb data
const Dashboard = (props) => {

  const { db, key } = React.useContext(DBcontext)
  const [locationData, setLocationData] = useState([])
  const [updateNeeded, setUpdateStatus] = useState(true)

  const [k, setK] = useState()

  const tabControl = async (t) => {
    props.setActiveTab(t)
    setK(t)
  }

  const deleteTab = async (index, city) => {
    let newTabIndex
    if (index - 1 < 0) {
      newTabIndex = index + 1
    } else {
      newTabIndex = index - 1
    }
    const newTabKey = locationData[newTabIndex].city
    deleteLocationData(db, city)
    deleteWeatherData(db, city)
    props.setActiveTab(newTabKey)
    setK(newTabKey)
    locationData.splice(index, 1)
  }



  //use updateData and dataUpdated to manipulate updateNeeded state
  //true will trigger an update
  const updateData = () => {
    setUpdateStatus(true)
  }

  const dataUpdated = () => {
    setUpdateStatus(false)
  }

  //pulls saved location data from index db to create dashboard tabs
  //updateNeeded used to prevent infinite loop, set to true to pull new location data for dashboard
  //all other weather data handled within tabs to decrease load times
  useEffect(() => {
    console.log("use eff")
    const updateLocationData = async () => {
      //pulls saved names and coordinates
      let locationData = await getAllLocationData(db)
      setLocationData(locationData)
    }

    if (updateNeeded) {
      dataUpdated()
      updateLocationData()
    }
  }, [db, key, updateNeeded])

  const [show, setShow] = useState(false)
  const toggleModal = () => { setShow(!show) }

  const [results, setResults] = useState([])
  const addResult = (data) => {
    setResults([...results, data])
  }

  const clearResults = () => {
    setResults([])
  }


  return (
    <Tabs id="uncontrolled-tab-example" className="tabs" activeKey={k} onSelect={(t) => tabControl(t)}>
      {
        locationData.map((data, i) => {
          //forces first tab to be active on load
          let initialSelect = "false"
          if (i < 1) {
            initialSelect = "true"
          }
          return (
            <Tab key={i + data.city} eventKey={data.city} title={<div className="title">{data.city}</div>} aria-selected={initialSelect}>
              <WeatherTab index={i} city={data.city} lat={data.lat} lon={data.lon} setBgColor={props.setBgColor} firstTab={initialSelect} setFirstColor={props.setFirstColor} deleteTab={deleteTab} addColor={props.addColor} />
            </Tab>
          )
        })
      }
      <Tab key={"+"} eventKey="+" title="+">
        <Container className="searchTab">
          <div className="mainContent bg">
            <SearchBar results={results} addResult={addResult} />
            <ul>
              {results.map((result) => <Results key={result.name} name={result.name} country={result.sys.country} temp={result.main.temp} lat={result.coord.lat} lon={result.coord.lon} update={updateData} clear={clearResults}/>)}
            </ul>
          </div>
        </Container>
      </Tab>
    </Tabs >
  )
}

export default Dashboard