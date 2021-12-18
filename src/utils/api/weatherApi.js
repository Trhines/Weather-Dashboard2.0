//returns object with city name and coord to be stored in savedLocations
export const callApi = async (search, key) => {
    try {
        const { city, state, country } = search
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=imperial&appid=${key}`)
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