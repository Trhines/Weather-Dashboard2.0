//h=hue, s=saturation l=lightness

//1=day 2=night
const h1 = 200
const h2 = 260
const s1 = 100
const s2 = 40
const l1 = 80
const l2 = 20

const dayMax = +12
const nightMax = -12

//converts time stamp to local 24 hour time, returns hour 0-24
const getLocalizedHours = (unixTime, timeZone) =>{
    const date = new Date(unixTime)
    const adjustedTime = date.toLocaleString('en-us', {timeZone: timeZone})
    const localTime = new Date(adjustedTime)
    const time = localTime.getHours()
    return time
}

//linear interpolation function, use for finding time in radians and color values
const lerp = (x, x1, x2, y1, y2) => {
    let output = y1 + ( ((x-x1) * (y2-y1)) / (x2-x1) )
    return output
}

//sin func, takes radians, use return to interpolate color values
const sin = (rad) => {
    let x = rad * Math.PI
    let val = Math.sin(x)
    return val
}

//runs everything
const getColor = (t, timeZone, rise, secondRise) => {
    t = getLocalizedHours(t, timeZone)
    const sunrise = getLocalizedHours(rise*1000, timeZone)
    const second_rise = getLocalizedHours(secondRise*1000, timeZone)
    const dayLength = (second_rise + 24) - sunrise
    const adjustedTime = t - sunrise
    const radians = lerp(adjustedTime, 0, dayLength, 0, 2)
    const colorVal = (sin(radians)) * 12
    const h = lerp(colorVal, dayMax, nightMax, h1, h2)
    const s = lerp(colorVal, dayMax, nightMax, s1, s2)
    const l = lerp(colorVal, dayMax, nightMax, l1, l2)
    return {h, s, l}
}


export default getColor