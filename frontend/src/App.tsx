import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import type { Day, Period, Timetable } from 'timetable'
import Message, { Notice } from 'Message'
import Bell from 'Bell'
import Footer from 'Footer'
import { v4 } from 'uuid'
import classNames from 'utils/classNames'
import Alert from 'Alert'
import { Exclamation, Plus, ThreeDots } from 'components/Icons'
import Loading from 'Loading'
import Password from 'Password'
import { SHA256 } from 'crypto-js'
import Login from 'Login'

const App = () => {
  const getDefaultDay = () => {
    let day = new Date().getDay() - 1
    if (day === -1)
      day = 0
    if (day === 5)
      day = 4
    return day
  },
    [timetable, setTimetable]: [Day[], Dispatch<SetStateAction<Day[]>>] = useState<Day[]>([[], [], [], [], []]),
    [day, setDay] = useState(getDefaultDay()),
    [notices, setNotices]: [Notice[], Dispatch<SetStateAction<Notice[]>>] = useState<Notice[]>([]),
    [active, setActive] = useState(0),
    [updateFailed, setUpdateFailed] = useState(false),
    [loading, setLoading] = useState(true),
    [loadingItems, setLoadingItems] = useState<string[]>([]),
    [passwordSet, setPasswordSet] = useState(true),
    [settingPassword, setSettingPassword] = useState(false),
    [login, setLogin] = useState(false),
    [loggingIn, setLoggingIn] = useState(false),
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
        body: JSON.stringify({
          bell: {
            id: v4(),
            name: 'New Bell',
            hour: Math.floor(Math.random() * 24),
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
        body: period.bell.id
      })
        .then(updateTimetable)
    },
    patchMinute = (event: ChangeEvent<HTMLSelectElement>, period: Period) => {
      fetch('/api/v1/timetable', {
        method: 'PATCH',
        body: JSON.stringify({
          id: period.bell.id,
          name: period.bell.name,
          hour: period.bell.hour,
          minute: parseInt(event.target.value, 10)
        })
      })
        .then(updateTimetable)
    },
    patchHour = (event: ChangeEvent<HTMLSelectElement>, period: Period) => {
      fetch('/api/v1/timetable', {
        method: 'PATCH',
        body: JSON.stringify({
          id: period.bell.id,
          name: period.bell.name,
          hour: parseInt(event.target.value, 10),
          minute: period.bell.minute
        })
      })
        .then(updateTimetable)
    },
    patchName = (event: ChangeEvent<HTMLInputElement>, period: Period) => {
      fetch('/api/v1/timetable', {
        method: 'PATCH',
        body: JSON.stringify({
          id: period.bell.id,
          name: event.target.value,
          hour: period.bell.hour,
          minute: period.bell.minute
        })
      })
        .then(updateTimetable)
    },
    putPassword = (previous: string, next: string) => {
      setSettingPassword(true)
      fetch('/api/v1/auth/password', {
        method: 'PUT',
        body: JSON.stringify({
          old: SHA256(previous).toString(),
          new: SHA256(next).toString()
        })
      })
        .then(() => {
          setPasswordSet(true)
          setSettingPassword(false)
          addLoadingItem('Password set. Getting token...')
          fetch(`/api/v1/auth/token?password=${SHA256(next).toString()}`)
            .then(response => response.text())
            .then(token => {
              console.log(token)
              window.addEventListener('beforeunload', () => {
                fetch(`/api/v1/auth/token?token=${token}`, {
                  method: 'DELETE'
                })
                .catch(reason => {
                  console.log(reason)
                })
              })
              setLoading(false)
            })
        })
    },
    setPassword = (password: string) => {
      setLoggingIn(true)
      addLoadingItem('Getting token...')
      fetch(`/api/v1/auth/token?password=${SHA256(password).toString()}`)
        .then(response => {
          setLogin(false)
          return response.text()
        })
        .then(token => {
          console.log(token)
          window.addEventListener('beforeunload', () => {
            fetch(`/api/v1/auth/token?token=${token}`, {
              method: 'DELETE'
            })
            .catch(reason => {
              console.log(reason)
            })
          })
          setLoading(false)
        })
    },
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    addLoadingItem = (item: string) => {
      setLoadingItems(previous => {
        const next = [...previous]
        next.push(item)
        return next
      })
    }
  useEffect(updateTimetable, [day])
  useEffect(() => {
    addLoadingItem('Getting notices...')
    setNotices([
      {
        content: 'D13 & D14 classes will be running in B2 as carpets are replaced.',
        priority: true,
        time: 'Today',
        title: 'D Block Room Changes'
      },
      {
        content: 'French will be off today due to a Year 11 excursion occuring. See you next week!',
        priority: false,
        time: 'Until 12th September',
        title: 'French Club'
      },
      {
        content: 'Meeting tomorrow lunch in TLC for Year 9 will be running outlining the subject selection process for 2024.',
        priority: false,
        time: 'Until tomorrow',
        title: 'Y9 2024 Subject Selection'
      }
    ])
    addLoadingItem('Done.')
    addLoadingItem('Checking for password...')
    fetch('/api/v1/auth/password').then(value => {
      return value.text()
    })
      .then(value => {
        if (value) {
          addLoadingItem('Password set. Authenticating...')
          setLogin(true)
        } else {
          addLoadingItem('Password not set. Prompting user...')
          setPasswordSet(false)
        }
      })
  }, [])
  return <>
    <div className='py-4 bg-gray-50 h-full flex flex-col gap-4 font-semibold tracking-tighter leading-none md:pb-0'>
      <div className='flex h-full overflow-x-auto snap-mandatory snap-x scroll-smooth md:p-4 md:grid md:grid-cols-2 md:gap-4 no-scrollbar' onScroll={event => {
        const scroll = event.currentTarget.scrollLeft / event.currentTarget.scrollWidth * 2
        if (Math.abs(scroll - Math.round(scroll)) < 10)
          setActive(Math.round(scroll))
      }} ref={scroll}>
        <div className='md:border md:shadow-lg md:rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
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
        <div className='md:border md:shadow-lg md:rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
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
              <span className='bg-gray-200 rounded-xl text-gray-500 flex gap-2 items-center p-2'>
                Day
                <select
                  className='text-black appearance-none bg-transparent'
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
                className='bg-black text-white flex p-2 gap-2 items-center rounded-full whitespace-nowrap'
                onClick={updateFailed ? undefined : postBell}
              >
                <Plus />
                Add Bell
              </button>
            </span>
            <span className='flex gap-2 flex-wrap whitespace-nowrap'>
              <Alert
                text='Failed to get timetable.'
                show={updateFailed}
                colour='bg-rose-500'
                icon={<Exclamation />}
              />
              <Alert
                text={`No bells found for ${days[day]}.`}
                show={timetable[day].length === 0}
                colour='bg-rose-500'
                icon={<Exclamation />}
              />
              <Alert
                text='Showing Monday bell times.'
                show={true}
                colour='bg-blue-500'
                icon={<ThreeDots />}
              />
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
    <Loading show={loading} items={loadingItems} />
    <Password show={!passwordSet} inProgress={settingPassword} putPassword={putPassword} />
    <Login show={login} inProgress={loggingIn} login={setPassword} />
  </>
}

export default App
