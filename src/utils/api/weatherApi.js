
//returns object with city name and coord to be stored in savedLocations
export const callApi = async (search, key) => {
    try {
        const { city, state, country } = search
        let startString = `https://api.openweathermap.org/data/2.5/weather?q=${city}`
        let endString = `&units=imperial&appid=${key}`
        let stateString;
        let countryString;

        state ? (stateString = `,${state.toUpperCase()}`) : (stateString = "")
        country ? (countryString = `,${country.toUpperCase()}`) : (countryString = "")

        let queryString = startString + stateString + countryString + endString
        console.log(queryString)
        const response = await fetch(queryString)
        if(response.status === 404){
            return("404")
        }
        const data = await response.json()
        if (data) {
            return data
        }
    } catch (err) { console.log(err) }
}

//gets weather infromation based on coordinates
export const getWeatherData = async (lat, lon, key) => {
    try {
        const allData = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${key}`)
        const weatherData = await allData.json()
        return weatherData
    } catch (err) { console.log(err) }
}


//only returns the timezone, used for search results
export const getTimeZone = async (lat, lon, key) => {
    try {
        const data = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,daily,current&appid=${key}`)
        const alldata = await data.json()
        console.log(alldata.timezone)
        return alldata.timezone
    } catch (err) { console.log(err) }
}