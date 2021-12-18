//all functions must have db as argument
//localbase can only handle one request at a time, implement funcs with async and await responses

//returns all saved location data
export const getAllLocationData = async (db) => {
    const data = await db.collection('savedLocations').get()
    return data
}

export const getLocationData = async (db, name) => {
  const data = await db.collection('savedLocations').doc({city: name}).get()
  return data
}

//saves new locations, must have name, and coordinates as arguments
export const saveLocationData = (db, name, lat, lon) => {
  // const data = getLocationData(db, name)
  // console.log(data)
  const response = db.collection('savedLocations').add({city: name, lat: lat, lon: lon})
  return response
}

export const saveWeatherData = (db, time, name, weather) => {
  const response = db.collection('savedWeatherData').add({city: name, timeStamp: time, weather: weather})
  return response
}

export const getSavedWeatherData = async (db, name) => {
  const data = await db.collection('savedWeatherData').doc({city: name}).get()
  return data
}

