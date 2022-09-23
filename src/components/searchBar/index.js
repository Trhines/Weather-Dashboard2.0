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
        setLocation({ ...location, [name]: value })
    }

    const submitSearch = async () => {
        const data = await callApi(location, key)
        console.log(data)
        props.addResult(data)
    }

    return (
        <div className="flex-center">
            <Form>
                <Form.Group className="margin" controlId="formBasicEmail">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="email" placeholder="City" name="city" value={location.city} onChange={handleLocationChange} />
                </Form.Group>
                <div className="inline-flex-center">
                    <Form.Group className="margin" controlId="formBasicPassword">
                        <Form.Label>State</Form.Label>
                        <Form.Select name="state" value={location.state} onChange={handleLocationChange}>
                            <option></option>
                            <option>CA</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="margin">
                        <Form.Label>Country</Form.Label>
                        <Form.Select name="country" value={location.country} onChange={handleLocationChange}>
                            <option></option>
                            <option>US</option>
                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary margin margin-top realative-top" className="button" onClick={submitSearch}>
                        Search
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default SearchBar