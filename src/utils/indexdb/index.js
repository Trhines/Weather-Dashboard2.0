//all functions must have db as argument
//localbase can only handle one request at a time, implement funcs with async and await responses
// https://github.com/dannyconnell/localbase


export const getAllLocationData = async (db) => {
    const data = await db.collection('savedLocations').get()
    return data
}

export const getLocationData = async (db, name) => {
  const data = await db.collection('savedLocations').doc({city: name}).get()
  return data
}


export const saveLocationData = (db, name, lat, lon) => {
  const response = db.collection('savedLocations').add({city: name, lat: lat, lon: lon})
  return response
}

export const deleteLocationData = async(db, city) => {
  const response = await db.collection('savedLocations').doc({city: city}).delete()
  return response
}




export const saveWeatherData = async (db, time, name, weather) => {
  const response = db.collection('savedWeatherData').add({city: name, timeStamp: time, weather: weather})
  return response
}

export const getSavedWeatherData = async (db, name) => {
  const data = await db.collection('savedWeatherData').doc({city: name}).get()
  return data
}

export const updateSavedWeatherData = async (db, time, name, weather) => {
  const data = await db.collection('savedWeatherData').doc({city: name}).set({city: name, timeStamp: time, weather: weather})
  return data
}

export const deleteWeatherData = async(db, city) => {
  const response = await db.collection('savedWeatherData').doc({city: city}).delete()
  return response
}

