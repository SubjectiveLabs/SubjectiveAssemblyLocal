import { useEffect, useState } from 'react'
import Time from 'Time'
import classNames from 'classNames'

const Bell = ({ number, time }: { number: number, time: Time }) => {
  const [ rendered, setRendered ] = useState(false)
  useEffect(() => {
    setRendered(true)
  }, [])
  return <div className={classNames(
    'text-gold-200 transition duration-300 text-center',
    rendered
      ? 'scale-100'
      : 'scale-0'
  )}>
    BELL {number} {time.hour}: {time.minute}
  </div>
}
export default Bell
