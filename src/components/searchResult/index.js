import React from 'react'
import { useState, useEffect } from 'react'
import { DBcontext } from '../backgroundContainer'
import Button from 'react-bootstrap/Button'
import './index.css'
import { getLocationData, saveLocationData } from '../../utils/indexdb'
import { getTimeZone } from '../../utils/api/weatherApi'
import { formatTemp } from '../../utils/unitConversions'

const Results = (props) => {

    const { db, key } = React.useContext(DBcontext)

    const [tz, setTz] = useState("")

    const save = async () => {
        const data = await getLocationData(db, props.name, props.lat, props.lon, props.update)
        if (!data) {
            let response = await saveLocationData(db, props.name, props.lat, props.lon)
            if (response.success) {
                props.update()
            }
            props.clear()
        } else { props.clear() }
    }
    useEffect(() => {
        const findTz = async () => {
            let timeZone = await getTimeZone(props.lat, props.lon, key)
            setTz(`${timeZone}`)
        }
        findTz()
    }, [])

    return (
        <div className="result-container">
            <div className="result-row">
                <div className="result">{props.name}</div>
                <div className="result">{props.country}</div>
                <div className="result">{tz}</div>
                <div className="result">{formatTemp(props.temp)}</div>
                <Button variant="btn" className="button addBtn btn-btn" onClick={save}>Add</Button>
            </div>
        </div>
    )
}

export default Results