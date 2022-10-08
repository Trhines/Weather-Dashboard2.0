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
import getCoord from '../../utils/interpolation/index'





const WeatherTab = ({ city, lat, lon, logState, deleteTab, index }) => {

    const { db, key } = React.useContext(DBcontext)

    const [currentData, setcurrentData] = useState(null)
    const [show, setShow] = useState(false)

    const currentMilliseconds = Date.now()
    const currentSeconds = Math.floor(currentMilliseconds / 1000)

    const getDate = (unixTimeStamp) => {
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

    const circle = (r) => {
        const c = 2 * Math.PI * r
        const arc = c / 2
        let coord = getCoord(currentMilliseconds, currentData.weather.timezone, currentData.weather.current.sunrise, currentData.weather.daily[1].sunrise, currentData.weather.current.sunset, r)
        let offset = { x: -161, y: 0 }
        let symbol = <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16" className="sun"
            style={{ position: "relative", top: -Math.abs(coord.y + offset.y), right: coord.x + offset.x }}>
            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
        </svg>;
        if (coord.symbol === "moon") {
            offset = { x: -161, y: 0 }
            symbol = <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16 " className="moon"
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
                        stroke-width="2px"
                        stroke-dasharray={arc}
                        stroke-dashoffset={arc} />
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
                    <h1>Today</h1>
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
                                    {circle(130)}
                            </div>
                            <div className="leftBody">
                                <div className="leftContainer">
                                    <div className="verticalMarginAuto">Low: {formatTemp(currentData.weather.daily[0].temp.min)}</div>
                                    <div className="verticalMarginAuto">High: {formatTemp(currentData.weather.daily[0].temp.max)}</div>
                                    <div className="verticalMarginAuto">Wind speed: {currentData.weather.current.wind_speed}</div>
                                    <div className="verticalMarginAuto">Humidity: {currentData.weather.current.humidity}</div>
                                </div>
                                <div className="leftContainer">
                                    <div className="verticalMarginAuto">Humidity: {currentData.weather.current.pressure}</div>
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
                        <Row className="forcast"><h1>Forcast</h1></Row>
                        {dailyForcast}
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