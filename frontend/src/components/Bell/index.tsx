import { useContext } from 'react'
import classNames from 'classNames'
import { BellTime } from 'backend'
import { AppContext } from 'App'
import { v4 } from 'uuid'
import { Pages, Bin, BellIcon } from 'components/Icons'

const Bell = ({ bellTime }: { bellTime: BellTime }) => {
  const { school: [, setSchool] } = useContext(AppContext)
  return <div className='border rounded-2xl p-4 flex gap-4 items-center'>
    <button
      className={classNames(
        'inline-flex bg-red-500 p-2 rounded-xl aspect-square',
      )}
      onClick={() => {
        setSchool(previous => {
          const next = { ...previous }
          next.bellTimes = next.bellTimes.map(day => day.filter(period => period.id !== bellTime.id))
          return next
        })
      }}
    >
      <svg width={16} height={16} viewBox='0 0 16 16'>
        <path
          d={Bin}
          className='fill-white'
        />
      </svg>
    </button>
    <button
      className={classNames(
        'inline-flex bg-black p-2 rounded-xl aspect-square',
      )}
      onClick={() => {
        setSchool(previous => {
          const next = { ...previous }
          next.bellTimes = next.bellTimes.map(day => {
            const index = day.findIndex(value => value.id == bellTime.id)
            if (index != -1) {
              const copy = { ...day[index] }
              copy.id = v4()
              day = [...day.slice(0, index), day[index], copy, ...day.slice(index + 1)]
            }
            return day
          })
          return next
        })
      }}
    >
      <svg viewBox='0 0 16 16' width={16} height={16}>
        <path d={Pages} className='stroke-white stroke-2 fill-none' strokeLinecap='round' strokeLinejoin='round' />
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
          next.bellTimes = next.bellTimes.map(day => day.map(period => {
            if (period.id === bellTime.id)
              return { ...period, name }
            return period
          }))
          return next
        })
      }} />
    <div className='bg-gray-200 flex p-1 rounded-xl h-full items-center divide-x divide-gray-300 [&>*]:px-1 [&>*:first-child]:pl-0 [&>*:first-child]:pr-1 [&>*:last-child]:pr-0 [&>*:last-child]:pl-1'>
      {
        [0, 1].map(index => <div key={index}>
          <button
            className={classNames(
              'p-1 rounded-lg transition',
              bellTime.enabled != !!index
                ? 'bg-gray-300'
                : ''
            )}
            onClick={() => {
              setSchool(previous => {
                const next = { ...previous }
                next.bellTimes = next.bellTimes.map(day => day.map(period => {
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
                d={BellIcon}
                className={classNames(
                  ['fill-green-500', 'fill-red-500'][index]
                )}
                strokeLinejoin='round'
                strokeLinecap='round'
              />
              <line
                x1={16}
                y1={0}
                x2={0}
                y2={16}
                className={classNames(
                  'transition',
                  index ? 'stroke-[3px]' : 'stroke-none',
                  index
                    ? bellTime.enabled != !!index
                      ? 'stroke-gray-300'
                      : 'stroke-gray-200'
                    : ''
                )}
              />
              <line
                x1={13}
                y1={3}
                x2={3}
                y2={13}
                className={classNames(
                  'transition',
                  index ? 'stroke-[2px]' : 'stroke-none',
                  index
                    ? 'stroke-red-500'
                    : ''
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
            next.bellTimes = next.bellTimes.map(day => day.map(period => {
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
            next.bellTimes = next.bellTimes.map(day => day.map(period => {
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
