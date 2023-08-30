import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import type { Day, Period, Timetable } from 'timetable'
import Message, { Notice } from 'Message'
import Bell from 'Bell'
import Footer from 'Footer'
import Header from 'Header'
import { v4 } from 'uuid'
import classNames from 'utils/classNames'

const App = () => {
  const getDefaultDay = () => {
    let day = new Date().getDay() - 1
    if (day === -1)
      day = 0
    if (day === 5)
      day = 4
    return day
  },
        [ timetable, setTimetable ]: [Day[], Dispatch<SetStateAction<Day[]>>] = useState<Day[]>([ [], [], [], [], [] ]),
        [ day, setDay ] = useState(getDefaultDay()),
        [ notices, setNotices ]: [Notice[], Dispatch<SetStateAction<Notice[]>>] = useState<Notice[]>([]),
        [ active, setActive ] = useState(0),
        [ updateFailed, setUpdateFailed ] = useState(false),
        scroll = useRef<HTMLDivElement>(null),
        updateTimetable = () => {
          setUpdateFailed(false)
          fetch('/api/v1/timetable').then(response => response.json())
            .then((data: Timetable) => {
              setTimetable(data.timetable)
            })
            .catch(() => {
              setUpdateFailed(true)
            })
        },
        postBell = () => {
          fetch('/api/v1/timetable', {
            method: 'POST',
            body  : JSON.stringify({
              bell: {
                id    : v4(),
                name  : 'New Bell',
                hour  : Math.floor(Math.random() * 24),
                minute: Math.floor(Math.random() * 60)
              },
              day
            })
          })
            .then(updateTimetable)
        },
        deleteBell = (period: Period) => {
          fetch('/api/v1/timetable', {
            method: 'DELETE',
            body  : period.bell.id
          })
            .then(updateTimetable)
        },
        patchMinute = (event: ChangeEvent<HTMLSelectElement>, period: Period) => {
          fetch('/api/v1/timetable', {
            method: 'PATCH',
            body  : JSON.stringify({
              id    : period.bell.id,
              name  : period.bell.name,
              hour  : period.bell.hour,
              minute: parseInt(event.target.value, 10)
            })
          })
            .then(updateTimetable)
        },
        patchHour = (event: ChangeEvent<HTMLSelectElement>, period: Period) => {
          fetch('/api/v1/timetable', {
            method: 'PATCH',
            body  : JSON.stringify({
              id    : period.bell.id,
              name  : period.bell.name,
              hour  : parseInt(event.target.value, 10),
              minute: period.bell.minute
            })
          })
            .then(updateTimetable)
        },
        patchName = (event: ChangeEvent<HTMLInputElement>, period: Period) => {
          fetch('/api/v1/timetable', {
            method: 'PATCH',
            body  : JSON.stringify({
              id    : period.bell.id,
              name  : event.target.value,
              hour  : period.bell.hour,
              minute: period.bell.minute
            })
          })
            .then(updateTimetable)
        },
        days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ]

  useEffect(updateTimetable, [day])
  useEffect(() => {
    setNotices([
      {
        content : 'D13 & D14 classes will be running in B2 as carpets are replaced.',
        priority: true,
        time    : 'Today',
        title   : 'D Block Room Changes'
      },
      {
        content : 'French will be off today due to a Year 11 excursion occuring. See you next week!',
        priority: false,
        time    : 'Until 12th September',
        title   : 'French Club'
      },
      {
        content : 'Meeting tomorrow lunch in TLC for Year 9 will be running outlining the subject selection process for 2024.',
        priority: false,
        time    : 'Until tomorrow',
        title   : 'Y9 2024 Subject Selection'
      }
    ])
  }, [])
  return <>
    <div className='py-4 bg-gray-50 h-full flex flex-col gap-4 font-semibold tracking-tighter leading-none md:pb-0'>
      <Header />
      <div className='flex h-full overflow-x-auto snap-mandatory snap-x scroll-smooth gap-8 p-4 md:grid md:grid-cols-2 md:gap-4 no-scrollbar' onScroll={event => {
        const scroll = event.currentTarget.scrollLeft / event.currentTarget.scrollWidth * 2
        if (Math.abs(scroll - Math.round(scroll)) < 10)
          setActive(Math.round(scroll))
      }} ref={scroll}>
        <div className='border shadow-lg rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
          <div className='gap-2 items-center flex text-xl'>
            <span className='bg-black w-6 h-6 inline-flex rounded-full rounded-bl-none'></span>
            Messages
          </div>
          <div className='flex gap-1'>
            <span className='text-gray-500'>Noticeboard</span>
            <span>{notices.length} notices</span>
          </div>
          <ul className='flex flex-col gap-4 overflow-y-auto rounded-2xl'>
            {notices.map((notice, index) => <Message key={index} notice={notice} />)}
          </ul>
        </div>
        <div className='border shadow-lg rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
          <div className='gap-2 items-center flex text-xl'>
            <span className='bg-black w-4 h-4 inline-flex rotate-45'></span>
            Bell Times
          </div>
          <div className='flex gap-2 justify-between border-b pb-2 flex-col'>
            <span className={classNames('flex items-center gap-2 justify-between',
              updateFailed
                  ? 'opacity-50 pointer-events-none'
                  : ''
            )}>
              <span className='bg-gray-200 p-2 rounded-xl text-gray-500 flex gap-2'>
                Day
                <select
                  className='appearance-none text-black bg-inherit'
                  defaultValue={getDefaultDay()}
                  onChange={event => {
                    setDay(parseInt(event.target.value, 10))
                  }}
                >
                  {
                    days.map((day, index) => <option
                      key={index}
                      value={index}
                    >
                      {day}
                    </option>)
                  }
                </select>
              </span>
              <button
                className='bg-black text-white flex p-2 pr-3 gap-2 items-center rounded-full'
                onClick={updateFailed ? undefined : postBell}
              >
                <svg viewBox='0 0 16 16' width={16} height={16}>
                  <circle cx={8} cy={8} r={8} className='fill-white' />
                  <path d='
                    M 8 2.5
                    q 1.25 0 1.25 1.25
                    v 3
                    h 3
                    q 1.25 0 1.25 1.25
                    t -1.25 1.25
                    h -3
                    v 3
                    q 0 1.25 -1.25 1.25
                    t -1.25 -1.25
                    v -3
                    h -3
                    q -1.25 0 -1.25 -1.25
                    t 1.25 -1.25
                    h 3
                    v -3
                    q 0 -1.25 1.25 -1.25
                    z'/>
                </svg>
                Add Bell
              </button>
            </span>
            <span className='flex gap-2 flex-wrap'>
              {
                updateFailed
                  ? <span className='bg-rose-500 p-2 rounded-full text-white inline-flex items-center gap-2'>
                      <svg viewBox='0 0 16 16' width={16} height={16}>
                        <circle cx={8} cy={8} r={8} className='fill-white' />
                        <circle cx={8} cy={12} r={2} className='fill-red-500' />
                        <path d='
                          M 8 2
                          q 2 0 2 2
                          v 3
                          q 0 2 -2 2
                          t -2 -2
                          v -3
                          q 0 -2 2 -2
                          z' className='fill-rose-500' />
                      </svg>
                    Failed to get timetable.
                    </span>
                  : null
              }
              {
                timetable[day].length === 0
                  ? <span className='bg-rose-500 p-2 rounded-full text-white inline-flex items-center gap-2'>
                      <svg viewBox='0 0 16 16' width={16} height={16}>
                        <circle cx={8} cy={8} r={8} className='fill-white' />
                        <circle cx={8} cy={12} r={2} className='fill-red-500' />
                        <path d='
                          M 8 2
                          q 2 0 2 2
                          v 3
                          q 0 2 -2 2
                          t -2 -2
                          v -3
                          q 0 -2 2 -2
                          z' className='fill-rose-500' />
                      </svg>
                    No bells found for {days[day]}.
                    </span>
                  : null
              }
              <span className='bg-blue-500 p-2 rounded-full text-white inline-flex items-center gap-2'>
                <svg viewBox='0 0 16 16' width={16} height={16}>
                  <circle cx={8} cy={8} r={8} className='fill-white' />
                  {[...Array(3)].map((_value, index, array) => <circle
                    key={index}
                    className='fill-blue-500'
                    cx={(4 * Math.cos((2 * Math.PI / array.length * index) - (Math.PI / 2))) + 8}
                    cy={(4 * Math.sin((2 * Math.PI / array.length * index) - (Math.PI / 2))) + 8}
                    r={2.5}
                  />)}
                </svg>
                Showing Monday bell times.
              </span>
            </span>
          </div>
          <ul className='flex flex-col gap-4 overflow-y-auto rounded-2xl'>
            {
              timetable[day].map(period => <Bell
                deleteBell={deleteBell}
                key={period.bell.id}
                patchHour={patchHour}
                patchMinute={patchMinute}
                patchName={patchName}
                period={period}
              />)
            }
          </ul>
        </div>
      </div>
      <div className='shrink grow-0 basis-auto md:hidden'>
        <Footer active={active} select={index => {
          scroll.current?.children[index].scrollIntoView()
        }} />
      </div>
    </div>
  </>
}

export default App
