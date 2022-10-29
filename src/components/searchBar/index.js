import { DBcontext } from '../backgroundContainer'
import './index.css'
import { callApi } from '../../utils/api/weatherApi.js'


import { useState } from 'react'
import React from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const SearchBar = (props) => {
    const { key } = React.useContext(DBcontext)

    const [location, setLocation] = useState({ city: "", state: "", country: "", })
    const handleLocationChange = (event) => {
        const { name, value } = event.target
        if(name !== "city"){
            if(value.length > 2 ){
                return
            }
        }
        setLocation({ ...location, [name]: value })
    }

    const submitSearch = async () => {
        const data = await callApi(location, key)
        if(data === "404"){
            alert("Location not found")
            return
        }
        props.addResult(data)
    }

    return (
        <div className="flex-center">
            <Form className="searchForm">
                <Form.Group className="margin" controlId="formBasicEmail">
                    <Form.Label>City</Form.Label>
                    <Form.Control placeholder="City" name="city" value={location.city} onChange={handleLocationChange} />
                </Form.Group>
                <div className="inline-flex-center">
                    <Form.Group className="margin" controlId="formBasicPassword">
                        <Form.Label>State Code</Form.Label>
                        <Form.Control className="locationCode" placeholder="CA" name="state" value={location.state} onChange={handleLocationChange} />
                    </Form.Group>

                    <Form.Group className="margin">
                        <Form.Label>Country Code</Form.Label>
                        <Form.Control className="locationCode" placeholder="US" name="country" value={location.country} onChange={handleLocationChange} />
                    </Form.Group>

                    <Button variant="btn margin margin-top realative-top" className="button searchBtn" onClick={submitSearch}>
                        Search
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default SearchBar