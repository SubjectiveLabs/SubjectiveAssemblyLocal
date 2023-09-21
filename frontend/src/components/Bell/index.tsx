import { useContext, useState } from 'react'
import classNames from 'classNames'
import { BellTime } from 'backend'
import { AppContext } from 'App'
import { Bin, Check, Cross } from 'components/Icons'

const Bell = ({ bellTime }: { bellTime: BellTime }) => {
  const [deleting, setDeleting] = useState(false),
    { school: [, setSchool] } = useContext(AppContext)
  return <div className='border rounded-2xl p-4 flex gap-4 items-center'>
    <button
      className={classNames(
        'inline-flex bg-red-500 p-2 rounded-xl aspect-square',
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
          d={Bin}
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
    <div className='bg-gray-200 flex p-1 rounded-xl h-full items-center divide-x divide-gray-300 [&>*]:px-1 [&>*:first-child]:pl-0 [&>*:first-child]:pr-1 [&>*:last-child]:pr-0 [&>*:last-child]:pl-1'>
      {
        [Check, Cross].map((icon, index) => <div key={index}>
          <button
            className={classNames(
              'p-1 rounded-lg transition',
              bellTime.enabled && index === 0 || !bellTime.enabled && index === 1
                ? 'bg-gray-300'
                : ''
            )}
            onClick={() => {
              setSchool(previous => {
                const next = { ...previous }
                next.bell_times = next.bell_times.map(day => day.map(period => {
                  if (period.id === bellTime.id)
                    return { ...period, enabled: !index }
                  return period
                }))
                return next
              })
            }}
          >
            <svg width={16} height={16} viewBox='0 0 16 16'>
              <path
                d={icon}
                className={classNames(
                  'fill-none stroke-[3px]',
                  ['stroke-green-500', 'stroke-red-500'][index]
                )}
                strokeLinejoin='round'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>)
      }
    </div>
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
