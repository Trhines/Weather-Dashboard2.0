//converts time stamp to local 24 hour time, returns hour 0-24
const getLocalizedHours = (unixTime, timeZone) =>{
    const date = new Date(unixTime)
    const adjustedTime = date.toLocaleString('en-us', {timeZone: timeZone})
    const localTime = new Date(adjustedTime)
    const time = localTime.getHours()
    return time
}

//linear interpolation function, use for finding time in degrees
const lerp = (x, x1, x2, y1, y2) => {
    let output = y1 + ( ((x-x1) * (y2-y1)) / (x2-x1) )
    return output
}

//runs everything
const getCoord = (t, timeZone, rise, secondRise, set, r) => {
    let time = getLocalizedHours(t, timeZone)
    //let time = 6
    const sunrise = getLocalizedHours(rise*1000, timeZone)
    const second_rise = getLocalizedHours(secondRise*1000, timeZone)
    const sunset = getLocalizedHours(set*1000, timeZone)
    let x1
    let x2
    const y1 = 0
    const y2 = Math.PI
    let x 
    let y
    let symbol
    if( time >= sunrise && time < sunset){
        x1 = sunrise
        x2 = sunset
        symbol = "sun"
    }
    if(time >= sunset){
        x1 = sunset
        x2 = second_rise + 24
        symbol = "moon"
    }
    if(time < sunrise){
        //if value is lower than current sunrise asume previous days value
        x1 = sunset - 24
        x2 = sunrise
        symbol = "moon"
    }
    const rad = lerp(time, x1, x2, y1, y2) + Math.PI
    x = Math.cos(rad) * r
    y = Math.sin(rad) * r
    return {x, y, symbol}
}


export default getCoord