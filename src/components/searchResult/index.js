import React from 'react'
import { DBcontext } from '../backgroundContainer'
import Button from 'react-bootstrap/Button'
import './index.css'
import { getLocationData, saveLocationData } from '../../utils/indexdb'

const Results = (props) => {

    const { db } = React.useContext(DBcontext)

    const save = async () => {
        const data = await getLocationData(db, props.name, props.lat, props.lon, props.update)
        if(!data){
            let response = await saveLocationData(db, props.name, props.lat, props.lon)
            if(response.success){
                props.update()
            }
            props.clear()
        } else { props.clear() }
    }

    return (
        <div className="result-row">
            <p className="state">{props.name}</p>
            <p>{props.country}</p>
            <p>{props.temp}</p>
            <Button onClick={save}>Add</Button>
        </div>
    )
}

export default Results