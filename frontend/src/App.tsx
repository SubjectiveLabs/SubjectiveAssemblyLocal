import { useRef, useState } from 'react'
import { DateTime } from 'luxon'
import Footer from 'Footer'
import config from 'config.json'

type Notice = {
  content: string,
  priority: boolean,
  time: string,
  title: string,
}

type Time = {
  hour: number
  minute: number
}

type Bell = {
  name: string,
  time: Time,
}

const App = () => {
  const bells: Bell[] = [
    {
      name: 'Period 1',
      time: {
        hour  : 8,
        minute: 38
      }
    },
    {
      name: 'Period 2',
      time: {
        hour  : 9,
        minute: 21
      }
    },
    {
      name: 'Recess',
      time: {
        hour  : 11,
        minute: 20
      }
    },
    {
      name: 'Period 3',
      time: {
        hour  : 12,
        minute: 34
      }
    },
    {
      name: 'Period 4',
      time: {
        hour  : 13,
        minute: 5
      }
    },
    {
      name: 'Period 5',
      time: {
        hour  : 14,
        minute: 34
      }
    },
    {
      name: 'Lunch',
      time: {
        hour  : 15,
        minute: 0
      }
    },
    {
      name: 'Period 6',
      time: {
        hour  : 15,
        minute: 38
      }
    }
  ],
        notices: Notice[] = [
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
        ],
        [ active, setActive ] = useState(0),
        scroll = useRef<HTMLDivElement>(null)
  return <>
    <div className='py-4 bg-gray-50 h-full flex flex-col gap-4 font-semibold tracking-tighter leading-none md:pb-0'>
      <header className='text-center flex flex-col shrink grow-0 basis-auto'>
        <h1>Welcome to</h1>
        <h1 className='flex items-center text-xl gap-2 justify-center font-bold'>
          <img src={config.schoolIconPath} alt={config.schoolName} className='h-6 ' />
          {config.schoolName}
        </h1>
      </header>
      <div className='flex h-full overflow-x-auto snap-mandatory snap-x scroll-smooth gap-8 p-4 md:grid md:grid-cols-2 md:gap-4' onScroll={event => {
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
            {
              notices.map((notice, index) => <div className='border rounded-2xl p-4' key={index}>
                <h2 className='font-bold flex gap-1 items-center'>
                  {
                    notice.priority && <span className='text-red-400 flex items-center gap-1'>
                      <span className='font-extrabold text-xl'>!</span>
                    Priority
                    </span>
                  }
                  {notice.title}
                </h2>
                <p className='text-gray-600 text-xm'>{notice.content}</p>
                <span className='text-gray-400 text-sm flex gap-1 items-center'>
                  <span className='bg-gray-400 w-3 h-3 inline-flex rounded-full'></span>
                  {notice.time}
                </span>
              </div>)
            }
          </ul>
        </div>
        <div className='border shadow-lg rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
          <div className='gap-2 items-center flex text-xl'>
            <span className='bg-black w-4 h-4 inline-flex rotate-45'></span>
            Bell Times
          </div>
          <div className='flex gap-1 justify-between items-center'>
            <span className='text-gray-500'>Today</span>
            <span className='bg-blue-500 p-2 rounded-full text-white flex items-center gap-2'>
              <span className='bg-white w-4 h-4 inline-flex rounded-full'></span>
              Showing Monday bell times.
            </span>
          </div>
          <ul className='flex flex-col gap-4 overflow-y-auto rounded-2xl'>
            {
              bells.map((bell, index) => <div className='border rounded-2xl p-4 flex justify-between' key={index}>
                <span>{bell.name}</span>
                <span>{DateTime.fromObject(bell.time).toLocaleString({
                  hour  : 'numeric',
                  hour12: true,
                  minute: 'numeric'
                })}</span>
              </div>)
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
