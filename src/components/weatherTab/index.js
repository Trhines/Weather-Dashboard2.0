import { useEffect, useState } from 'react'
import React from 'react'
import { getWeatherData } from '../../utils/api/weatherApi'
import { saveWeatherData, getSavedWeatherData, updateSavedWeatherData } from '../../utils/indexdb'
import { DBcontext } from '../backgroundContainer'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import './index.css'
import getCoord from '../../utils/interpolation/index'
import { getDirection, getPressure, formatTemp } from '../../utils/unitConversions/index'




const WeatherTab = ({ city, lat, lon, logState, deleteTab, index }) => {

    const { db, key } = React.useContext(DBcontext)

    const [currentData, setcurrentData] = useState(null)
    const [show, setShow] = useState(false)

    const currentMilliseconds = Date.now()

    const getDate = (unixTimeStamp) => {
        const dateObject = new Date(unixTimeStamp)
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

    const circle = (r) => {
        const c = 2 * Math.PI * r
        const arc = c / 2
        let coord = getCoord(currentMilliseconds, currentData.weather.timezone, currentData.weather.current.sunrise, currentData.weather.daily[1].sunrise, currentData.weather.current.sunset, r)
        let offset = { x: -161, y: 0 }
        let symbol = <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-brightness-high-fill sun" viewBox="0 0 16 16"
            style={{ position: "relative", top: -Math.abs(coord.y + offset.y), right: coord.x + offset.x }}>
            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
        </svg>;
        if (coord.symbol === "moon") {
            offset = { x: -161, y: 0 }
            symbol = <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-moon-fill moon" viewBox="0 0 16 16 "
                style={{ position: "relative", top: -Math.abs(coord.y + offset.y), right: coord.x + offset.x }}>
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
            </svg>
        }
        return (
            <div className="diagram">
                {symbol}
                <svg width="270" height="270" className="circle">
                    <circle cx="135" cy="135" r={r}
                        stroke="black"
                        strokeWidth="2px"
                        strokeDasharray={arc}
                        strokeDashoffset={arc} />
                </svg>
                <div className="temp">
                    {formatTemp(currentData.weather.current.temp)}
                </div>
                <div className="description">
                    <div >{currentData.weather.current.weather[0].description}</div>
                    <img src={getImageUrl(currentData.weather.current.weather[0].icon)} ></img>
                </div>
            </div>
        )
    }

    let Weather = <div>loading</div>

    useEffect(() => {
        const ifFirstTab = async (unix, timeZone, rise, secondRise) => {
            //let { h, s, l } = getColor(unix, timeZone, rise, secondRise)
        }
        //pulls fresh data from api and updates db and state
        const updateData = async (existingData) => {
            const data = await getWeatherData(lat, lon, key)
            const completeData = { city, weather: data }
            const timeStamp = currentMilliseconds
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
                if (currentMilliseconds - savedData.timeStamp < 1) {

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
        // let hourlyData = currentData.weather.hourly.map((hour) => <li className="hourlyItem">
        //     <div className="hourlyDiv">{getTime(currentData.weather.timezone, hour.dt)}<br></br>{formatTemp(hour.temp)}</div></li>)
        let hour = currentData.weather.hourly
        let hourlyForcast = [];
        //only showing 12 of 48 hours because I felt like it
        for (let i = 0; i < 12; i++) {
            let css = "forcast"
            if (i % 2 === 0) {
                css = "forcast altbg"
            }
            let newHour =
                <Row className={css}>
                    <Col className="day">
                        {getTime(currentData.weather.timezone, hour[i].dt)}
                    </Col>
                    <Col className="day">
                        Temp {formatTemp(hour[i].temp)}
                    </Col>
                    <Col md={2} className="icon">
                        <img src={getImageUrl(hour[i].weather[0].icon)}></img>
                    </Col>
                    <Col className="day">
                        {hour[i].weather[0].description}
                    </Col>
                </Row>;
            hourlyForcast = [...hourlyForcast, newHour]
        }





        let day = currentData.weather.daily
        let dailyForcast = [];
        for (let i = 0; i < day.length; i++) {
            let css = "forcast"
            if (i % 2 === 0) {
                css = "forcast altbg"
            }
            let newDay =
                <Row className={css}>
                    <Col className="day">
                        {getDate(day[i].dt)}
                    </Col>
                    <Col className="day">
                        Low {formatTemp(day[i].temp.min)}
                    </Col>
                    <Col className="day">
                        High {formatTemp(day[i].temp.max)}
                    </Col>
                    <Col md={2} className="icon">
                        <img src={getImageUrl(day[i].weather[0].icon)}></img>
                    </Col>
                    <Col className="day">
                        {day[i].weather[0].description}
                    </Col>
                </Row>;
            dailyForcast = [...dailyForcast, newDay]
        }

        Weather =
            <div>
                <div className="mainContent bg">
                    <div className="dashHeader">
                        <div className="txtContainer">
                            <h2 onClick={logState} className="headtxt">{currentData.city}</h2>
                            <h2 className="headtxt">{getDate(currentMilliseconds)}</h2>
                            <h2 className="headtxt">{getTime(currentData.weather.timezone)}</h2>
                        </div>
                        {/* <div className="headtxt"><Trash onClick={() => setShow(true)} /></div> */}
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" onClick={() => setShow(true)}>
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="mainBody">
                            <div className="rightBody">
                                {circle(130)}
                            </div>
                            <div className="leftBody">
                                <div className="leftContainer">
                                    <div className="verticalMarginAuto">Low: {formatTemp(currentData.weather.daily[0].temp.min)}</div>
                                    <div className="verticalMarginAuto">High: {formatTemp(currentData.weather.daily[0].temp.max)}</div>
                                    <div className="verticalMarginAuto">Wind Speed: {currentData.weather.current.wind_speed}</div>
                                    <div className="verticalMarginAuto">Wind Direction: {getDirection(currentData.weather.current.wind_deg)}</div>
                                    <div className="verticalMarginAuto">Humidity: {currentData.weather.current.humidity}%</div>
                                    <div className="verticalMarginAuto">Pressure: {getPressure(currentData.weather.current.pressure)}</div>
                                    <div className="verticalMarginAuto">Visibility: {currentData.weather.current.visibility}m</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mainContent bg">
                        <Row className="forcast"><h1>12 Hour Forcast</h1></Row>
                        {hourlyForcast}
                    </div>
                </div>
                <div>
                    <div className="mainContent bg">
                        <Row className="forcast"><h1>8 Day Forcast</h1></Row>
                        {dailyForcast}
                    </div>
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