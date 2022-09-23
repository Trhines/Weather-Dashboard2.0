import SearchBar from "../searchBar"
import Results from "../searchResult"
import Button from "react-bootstrap/Button"

import Modal from "react-bootstrap/Modal"

import { useState } from "react"

const SearchModal = ({show, setmodal, update}) => {
  //tracks api search results from searchbar
  const [results, setResults] = useState([])
  const addResult = (data) => {
    setResults([...results, data])
  }

  const clearResults = () => {
    setResults([])
  }

  //call when modal is needs to be closed
  const resetModal = () => {
    clearResults()
    setmodal()
  }

  return (
    <Modal
      show={show}
      
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={resetModal}>
        <Modal.Title id="contained-modal-title-vcenter">
          Search for a location
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <SearchBar results={results} addResult={addResult} />
      </Modal.Body>

      <Modal.Body>
        <ul>
          {results.map((result) => <Results key={result.name} name={result.name} country={result.sys.country} temp={result.main.temp} lat={result.coord.lat} lon={result.coord.lon} update={update}/>)}
        </ul>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={resetModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SearchModal