import { useEffect, useState } from 'react'
import React from 'react'
import { getWeatherData } from '../../utils/api/weatherApi'
import { saveWeatherData, getSavedWeatherData, updateSavedWeatherData } from '../../utils/indexdb'
import { DBcontext } from '../backgroundContainer'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons'
import './index.css'
import getColor from '../../utils/interpolation/index'





const WeatherTab = ({ city, lat, lon, logState, firstTab, setBgColor, setFirstColor, addColor, deleteTab, index }) => {

    const { db, key } = React.useContext(DBcontext)

    const [currentData, setcurrentData] = useState(null)
    const [tabBgColor, changeTabColor] = useState({ hue: 200, sat: 100, light: 80 })
    const [show, setShow] = useState(false)

    // const setTabColor = (h, s, l) => {
    //     changeTabColor({ hue: h, sat: s, light: l })
    // }

    const currentMilliseconds = Date.now()
    const currentSeconds = Math.floor(currentMilliseconds / 1000)

    const getDate = (unixTimeStamp) => {
        // const milliseconds = unixTimeStamp * 1000
        const dateObject = new Date(unixTimeStamp * 1000)
        const month = dateObject.toLocaleString("en-US", { month: "numeric" })
        const day = dateObject.toLocaleString("en-US", { day: "numeric" })
        const year = dateObject.toLocaleString("en-US", { year: "numeric" })
        return month + "/" + day + "/" + year
    }

    const getTime = (timeZone, timeStamp) => {
        let dateObject;
        if (timeStamp) {
            dateObject = new Date(timeStamp * 1000)
        } else {
            dateObject = new Date()
        }
        const unSplitTime = dateObject.toLocaleTimeString('en-us', { timeZone: timeZone })

        const amPm = unSplitTime.slice(-2)
        const splitTime = unSplitTime.split(":")
        const time = splitTime[0] + ":" + splitTime[1] + " " + amPm
        return time
    }

    const getImageUrl = (icon) => {
        return `http://openweathermap.org/img/wn/${icon}.png`
    }

    const formatTemp = (temp) => {
        return temp.toString().split('.')[0] + '\u00b0' + 'F'
    }

    let Weather = <div>loading</div>

    useEffect(() => {
        const ifFirstTab = async (unix, timeZone, rise, secondRise) => {
            let { h, s, l } = getColor(unix, timeZone, rise, secondRise)
            addColor({ city: city, hue: h, sat: s, light: l })
            if (firstTab === "true") {
                setFirstColor(h, s, l)
            }
        }
        //pulls fresh data from api and updates db and state
        const updateData = async (existingData) => {
            const data = await getWeatherData(lat, lon, key)
            const completeData = { city, weather: data }
            const timeStamp = currentSeconds
            if (!existingData) {
                saveWeatherData(db, timeStamp, city, data)
            }
            else {
                updateSavedWeatherData(db, timeStamp, city, data)
            }
            setcurrentData(completeData)
            return { zone: completeData.weather.timezone, rise: completeData.weather.current.sunrise, secondRise: completeData.weather.daily[1].sunrise }
        }

        const getCurrentData = async () => {
            //====================================================================================================================================
            //first checked to see if saved data exists for this location
            let savedData = await getSavedWeatherData(db, city)

            //if yes, checks timestamp
            if (savedData) {
                //if less than 300 seconds (5min) passes data is considered current
                if (currentSeconds - savedData.timeStamp < 300) {

                    setcurrentData(savedData)
                    ifFirstTab(currentMilliseconds, savedData.weather.timezone, savedData.weather.current.sunrise, savedData.weather.daily[1].sunrise)
                    return
                } else {
                    //if more than 5 minutes passes data is updated

                    let timeData = await updateData(savedData)
                    ifFirstTab(currentMilliseconds, timeData.zone, timeData.rise, timeData.secondRise)
                }
            } else {
                let timeData = await updateData(savedData)
                ifFirstTab(currentMilliseconds, timeData.zone, timeData.rise, timeData.secondRise)
            }
        }

        getCurrentData()


    }, [db, key, lat, lon, city])

    if (currentData) {

        let hourlyData = currentData.weather.hourly.map((hour) => <li className="hourlyItem">
            <div className="hourlyDiv">{getTime(currentData.weather.timezone, hour.dt)}<br></br>{formatTemp(hour.temp)}</div></li>)
        let dailyData = currentData.weather.daily.map((day) =>
            <Row className="forcast">
                <Col className="day">
                    {getDate(day.dt)}
                </Col>
                <Col className="day">
                    Low {formatTemp(day.temp.min)}
                </Col>
                <Col className="day">
                    High {formatTemp(day.temp.max)}
                </Col>
                <Col md={2} className="icon">
                    <img src={getImageUrl(day.weather[0].icon)}></img>
                </Col>
                <Col className="day">
                    {day.weather[0].description}
                </Col>
            </Row>
        )

        Weather =
            <div className="bgColors">

                <div className="mainContent bg">
                    <div className="dashHeader">
                        <div className="txtContainer">
                            <div onClick={logState} className="headtxt">{currentData.city}</div>
                            <div className="headtxt">{getDate(currentData.weather.current.dt)}</div>
                            <div className="headtxt">{getTime(currentData.weather.timezone)}</div>
                        </div>
                        <div className="headtxt"><Trash onClick={() => setShow(true)} /></div>
                    </div>
                    <div>
                        <div className="mainBody">
                            <div className="rightBody">
                                <div>
                                    <div className="temp">
                                        {formatTemp(currentData.weather.current.temp)}
                                    </div>
                                    <div className="inline">
                                        <div className="padL justifyR">{currentData.weather.current.weather[0].description}</div>
                                        <img className="padR" src={getImageUrl(currentData.weather.current.weather[0].icon)} ></img>
                                    </div>
                                </div>
                            </div>
                            <div className="leftBody">
                                <div className="leftContainer">
                                    <div className="verticalMarginAuto">Low: {formatTemp(currentData.weather.daily[0].temp.min)}</div>
                                    <div className="verticalMarginAuto">High: {formatTemp(currentData.weather.daily[0].temp.max)}</div>
                                    <div className="verticalMarginAuto">Wind speed: {currentData.weather.current.wind_speed}</div>
                                    <div className="verticalMarginAuto">Humidity: {currentData.weather.current.humidity}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='hourlyList'>
                        {hourlyData}
                    </div>
                </div>
                <div>
                    <Container>
                        {dailyData}
                    </Container>
                </div>
            </div>
    }

    return (

        <div>
            <div className="alertContainer">
                <Alert show={show} variant="danger" className="black">
                    <Alert.Heading>Delete this tab?</Alert.Heading>
                    <p className="black">
                        All data from this location will be removed
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => {
                            setShow(false)
                            deleteTab(index, city)
                        }} variant="outline-danger">
                            Delete this Tab
                        </Button>
                        <Button onClick={() => setShow(false)} variant="outline-primary">
                            Never mind
                        </Button>
                    </div>
                </Alert>
            </div>
            {Weather}
        </div>
    )
}

export default WeatherTab