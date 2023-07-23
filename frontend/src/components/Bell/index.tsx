import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import classNames from 'classNames'

const Bell = ({ number, time }: { number: number, time: DateTime }) => {
  const [ rendered, setRendered ] = useState(false)
  useEffect(() => {
    setRendered(true)
  }, [])
  return <div className={classNames(
    'text-cinder-950 bg-gold-200 rounded-md transition duration-300 text-center flex justify-between py-2 px-4',
    rendered
      ? 'scale-100'
      : 'scale-0'
  )}>
    <span className='tracking-[5px]'>BELL {number}</span>
    <span>{time.toLocaleString({
      hour  : '2-digit',
      hour12: false,
      minute: '2-digit'
    })}</span>
  </div>
}
export default Bell
