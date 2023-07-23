import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import classNames from 'classNames'

const Bell = ({ number, time }: { number: number, time: DateTime }) => {
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
    <span>BELL{number}</span>
    <span>{time.toLocaleString({
      hour  : '2-digit',
      hour12: false,
      minute: '2-digit'
    })}</span>
  </div>
}
export default Bell
