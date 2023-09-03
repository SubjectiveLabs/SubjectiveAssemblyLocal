import { ChangeEvent, useState } from 'react'
import { Period } from 'timetable'
import classNames from 'classNames'

const Bell = ({ period, deleteBell, patchName, patchHour, patchMinute }:
  {
    period: Period,
    deleteBell: (period: Period) => void,
    patchName: (event: ChangeEvent<HTMLInputElement>, period: Period) => void,
    patchHour: (event: ChangeEvent<HTMLSelectElement>, period: Period) => void,
    patchMinute: (event: ChangeEvent<HTMLSelectElement>, period: Period) => void,

  }) => {
  const [ deleting, setDeleting ] = useState(false)
  return <div className='border rounded-2xl p-4 flex gap-4 items-center' key={period.bell.id}>
    <button
      className={classNames(
        'inline-flex outline-red-300 outline-2 outline -outline-offset-2 bg-red-200 p-2 rounded-xl aspect-square',
        deleting
          ? 'animate-spin'
          : ''
      )}
      onClick={() => {
        if (!deleting)
          deleteBell(period)
        setDeleting(true)
      }}
    >
      &#128465
    </button>
    <input
      type='text'
      defaultValue={period.bell.name}
      className='bg-gray-200 rounded-xl p-1 w-full transition peer duration-300 h-full px-2'
      maxLength={127}
      required
      onChange={event => patchName(event, period)} />
    <div className='flex gap-1 items-center bg-gray-200 rounded-xl p-2 h-full'>
      <select
        className='appearance-none bg-gray-200'
        defaultValue={period.bell.hour}
        onChange={event => patchHour(event, period)}
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
        defaultValue={period.bell.minute}
        onChange={event => patchMinute(event, period)}
      >
        {[...Array(60)].map((_value, index) => <option
          key={index}
          value={index}
        >
          {index.toString().padStart(2, '0')}
        </option>)}
      </select>
    </div>
    <span className='text-gray-500 font-mono text-xs'>{period.bell.id.toString()}</span>
  </div>
}

export default Bell
