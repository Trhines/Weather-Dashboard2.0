import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Button from 'react-bootstrap/Button'

import { DBcontext } from '../../App'
import { useState, useEffect } from 'react'
import React from 'react'
import { getAllLocationData } from '../../utils/indexdb'
// import { getWeatherData } from '../../utils/api/weatherApi'

import SearchModal from "../search modal"
import WeatherTab from '../weatherTab'

//should return all tabs made based off of indexDb data
const Dashboard = () => {

  const { db, key } = React.useContext(DBcontext)
  const [locationData, setLocationData] = useState([])
  const [updateNeeded, setUpdateStatus] = useState(true)

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
  //all other weather data handled within tabs to increase load times
  useEffect(() => {

    const updateLocationData = async () => {
      //pulls saved names and coordinates
      let locationData = await getAllLocationData(db)
      setLocationData(locationData)
    }

    if (updateNeeded) {
      dataUpdated()
      updateLocationData()
    }

  }, [db, key, updateNeeded, locationData])

  const [show, setShow] = useState(false)
  const toggleModal = () => { setShow(!show) }

  return (
    <Tabs id="uncontrolled-tab-example" className="mb-3">
      {
        locationData.map((data, i) => {
          //forces first tab to be active on load
            let initialSelect = "false"
          if(i < 1){
            initialSelect = "true"
          }
          return(
            <Tab key={i} eventKey={data.city} title={data.city} aria-selected={initialSelect}>
              <WeatherTab index={i} city={data.city} lat={data.lat} lon={data.lon}/>
            </Tab>
          )
        })
      }
      <Tab key={"+"} eventKey="+" title="+">
        <Button onClick={toggleModal} >Add new location</Button>
        <SearchModal show={show} setmodal={toggleModal} update={updateData}/>
      </Tab>
    </Tabs >
  )
}

export default Dashboard