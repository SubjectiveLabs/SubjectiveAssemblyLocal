import { useContext, useState } from 'react'
import classNames from 'classNames'
import { BellTime } from 'backend'
import { AppContext } from 'App'

const Bell = ({ bellTime }: { bellTime: BellTime }) => {
  const [deleting, setDeleting] = useState(false),
    [, setSchool] = useContext(AppContext)
  return <div className='border rounded-2xl p-4 flex gap-4 items-center'>
    <button
      className={classNames(
        'inline-flex bg-rose-400 p-2 rounded-xl aspect-square',
      )}
      onClick={() => {
        if (!deleting) {
          setSchool(previous => {
            const next = { ...previous }
            next.bell_times = next.bell_times.map(day => day.filter(period => period.id !== bellTime.id))
            return next
          })
        }
        setDeleting(true)
      }}
    >
      <svg width={16} height={16} viewBox='0 0 16 16'>
        <path
          d="
            M 5 1
            l 6 0
            l 1 2
            l 2 0
            l 0 1
            l -12 0
            l 0 -1
            l 2 0
            z
            M 3.5 5
            l 9 0
            l -0.5 9
            l -8 0

          "
          className='fill-white'
        />
      </svg>
    </button>
    <input
      type='text'
      defaultValue={bellTime.name}
      className='bg-gray-200 rounded-xl p-1 w-full transition peer duration-300 h-full px-2'
      maxLength={127}
      required
      onBlur={event => {
        const name = event.target.value
        setSchool(previous => {
          const next = { ...previous }
          next.bell_times = next.bell_times.map(day => day.map(period => {
            if (period.id === bellTime.id)
              return { ...period, name }
            return period
          }))
          return next
        })
      }} />
    <div className='flex gap-1 items-center bg-gray-200 rounded-xl p-2 h-full'>
      <select
        className='appearance-none bg-gray-200'
        defaultValue={bellTime.hour}
        onChange={event => {
          const hour = parseInt(event.target.value, 10)
          setSchool(previous => {
            const next = { ...previous }
            next.bell_times = next.bell_times.map(day => day.map(period => {
              if (period.id === bellTime.id)
                return { ...period, hour }
              return period
            }))
            return next
          })
        }}
      >
        {[...Array(24)].map((_value, index) => <option
          key={index}
          value={index}
        >
          {index}
        </option>)}
      </select>
      :
      <select
        className='appearance-none bg-gray-200'
        defaultValue={bellTime.minute}
        onChange={event => {
          const minute = parseInt(event.target.value, 10)
          setSchool(previous => {
            const next = { ...previous }
            next.bell_times = next.bell_times.map(day => day.map(period => {
              if (period.id === bellTime.id)
                return { ...period, minute }
              return period
            }))
            return next
          })
        }}
      >
        {[...Array(60)].map((_value, index) => <option
          key={index}
          value={index}
        >
          {index.toString().padStart(2, '0')}
        </option>)}
      </select>
    </div>
  </div>
}

export default Bell
