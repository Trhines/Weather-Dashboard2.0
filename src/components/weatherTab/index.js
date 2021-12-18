import { useEffect, useState } from 'react'
import React from 'react'
import { getWeatherData } from '../../utils/api/weatherApi'
import { saveWeatherData, getSavedWeatherData } from '../../utils/indexdb'
import { DBcontext } from '../../App'




const WeatherTab = ({ city, lat, lon }) => {

    const { db, key } = React.useContext(DBcontext)

    const [currentData, setcurrentData] = useState([])

    useEffect(() => {
        //pulls fresh data from api and updates db and state
        const updateData = async () => {
            const { daily } = await getWeatherData(lat, lon, key)
            const completeData = { city, ...daily }
            const timeStamp = (Math.floor(Date.now()/1000))
            saveWeatherData(db, timeStamp, city, daily)
            setcurrentData(completeData)
        }
        const getCurrentData = async () => {
            //first checked to see if saved data exists for this location
            let savedData = await getSavedWeatherData(db, city)
            //if yes, checks timestamp
            if(savedData){
                let now = Math.floor(Date.now()/1000)
                //if less than 1800 secons (30min) passes data is considered current
                if(now - savedData.timeStamp < 1800){
                    setcurrentData(savedData)
                return
                } else {
                    //if more than 30 minutes passes data is updated
                    updateData()
                }
            } 
            //if no, calls for new data, saves the new data, and updates state
                else {
                    updateData()
            }
        }
        getCurrentData()
    }, [db, key, lat, lon, city])

    return (
        //place holder for actual data
        <div>{currentData.city}</div>
    )
}

export default WeatherTab