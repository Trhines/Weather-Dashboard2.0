export const getDirection = (deg) => {
    const Directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"]
    let index = Math.floor(deg/22.5) + 1
    const str = Directions[index] + " " + deg.toString() + "\u00B0"
    return(str)
}

export const getPressure = (hPa) => {
    let iom = (hPa * 0.02953).toFixed(2)
    iom.toString()
    return(iom)
}

export const formatTemp = (temp) => {
    return temp.toString().split('.')[0] + '\u00b0' + 'F'
}