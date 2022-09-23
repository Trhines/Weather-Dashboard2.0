import React from 'react'
import { useEffect, useState } from 'react'

const Clock = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      setInterval(() => {
        setCount(prevCount => prevCount + 1);
      }, 1000);
    }, []);
    return(
        <div>time {count}</div>
    )
}
export default Clock