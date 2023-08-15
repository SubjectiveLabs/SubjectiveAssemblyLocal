import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import Message, { Notice } from 'Message'
import Footer from 'Footer'
import Header from 'Header'


type Time = {
  hour: number
  minute: number
}

type Bell = {
  id: number,
  name: string,
  time: Time,
}

const App = () => {
  const [ bells, setBells ]: [Bell[], Dispatch<SetStateAction<Bell[]>>] = useState<Bell[]>([]),
        [ notices, setNotices ]: [Notice[], Dispatch<SetStateAction<Notice[]>>] = useState<Notice[]>([]),
        [ active, setActive ] = useState(0),
        scroll = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/v1/timetable').then(response => {
      response.body?.getReader().read()
        .then(value => {
          if (!value.value)
            return

          let bytes = Array.from(value.value)
          bytes = bytes.slice(3)
          const bells = []
          while (bytes.length > 0) {
            const decoder = new TextDecoder(),
                  id = bytes.shift(),
                  name = decoder.decode(new Uint8ClampedArray(bytes.splice(0, bytes.shift()))),
                  timeBytes = new Uint8ClampedArray(bytes.splice(0, 2))
            let time = 0
            timeBytes.forEach(byte => {
              if (!byte)
                return
              time *= 0x100
              time += byte
            })

            bells.push({
              id  : id as number,
              name,
              time: {
                hour  : Math.floor(time / 60),
                minute: time % 60
              }
            })
          }
          setBells(bells)
        })
    })
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
            {notices.map((notice, index) => <Message key={index} notice={notice} />)}
          </ul>
        </div>
        <div className='border shadow-lg rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
          <div className='gap-2 items-center flex text-xl'>
            <span className='bg-black w-4 h-4 inline-flex rotate-45'></span>
            Bell Times
          </div>
          <div className='flex gap-2 justify-between border-b pb-2 flex-col xl:flex-row'>
            <span className='flex items-center gap-2'>
              <span className='text-gray-500'>Today</span>
              <button
                className='bg-black text-white flex p-2 pr-3 gap-2 items-center rounded-full'
                onClick={() => {
                  setBells(previous => {
                    const bells = [...previous],
                          // eslint-disable-next-line sort-vars
                          bell = {
                            id  : bells.length,
                            name: 'New Bell',
                            time: {
                              hour  : Math.floor(Math.random() * 24),
                              minute: Math.floor(Math.random() * 60)
                            }
                          },
                          byteArray = [],
                          encoder = new TextEncoder()
                    bells.push(bell)
                    bells.sort((first, second) => (first.time.hour * 60) + first.time.minute - (second.time.hour * 60) - second.time.minute)
                    byteArray.push(bell.id)
                    byteArray.push(encoder.encode(bell.name).length)
                    byteArray.push(...encoder.encode(bell.name))
                    byteArray.push(bell.time.hour)
                    byteArray.push(bell.time.minute)

                    fetch('/api/v1/timetable', {
                      body  : new Uint8ClampedArray(byteArray),
                      method: 'POST'
                    })

                    return bells
                  })
                }}
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
            <span className='flex gap-2 flex-col lg:flex-row'>
              {
                bells.length === 0
                  ? <span className='bg-rose-500 p-2 rounded-full text-white flex items-center gap-2'>
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
                      No bells found.
                    </span>
                  : null
              }
              <span className='bg-blue-500 p-2 rounded-full text-white flex items-center gap-2'>
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
              bells.map((bell, index) => <div className='border rounded-2xl p-4 flex gap-4 items-center' key={bell.id}>
                <button
                  className='inline-flex outline-red-300 outline-2 outline -outline-offset-2 bg-red-200 p-2 rounded-xl aspect-square'
                  onClick={() => {
                    setBells(previous => {
                      const bytes: number[] = [],
                            next = [...previous]
                      bytes.push(next[index].id)
                      fetch('/api/v1/timetable', {
                        body  : new Uint8ClampedArray(bytes),
                        method: 'DELETE'
                      })
                      next.splice(next.findIndex(thisBell => thisBell.id === bell.id), 1)
                      return next
                    })
                  }}
                >
                    &#128465;
                </button>
                <input
                  type='text'
                  defaultValue={bell.name}
                  className='bg-gray-200 rounded-xl p-1 w-full transition peer duration-300 h-full px-2'
                  maxLength={127}
                  required
                  onChange={event => {
                    setBells(previous => {
                      const bytes: number[] = [],
                            encodedName = new TextEncoder().encode(event.target.value),
                            next = [...previous]
                      next[index].name = event.target.value
                      bytes.push(next[index].id)
                      bytes.push((encodedName.length & 0b0111_1111))
                      bytes.push(...encodedName)

                      fetch('/api/v1/timetable', {
                        body  : new Uint8ClampedArray(bytes),
                        method: 'PATCH'
                      })

                      return next
                    })
                  }}
                />
                <div className='flex gap-1 items-center bg-gray-200 rounded-xl p-2 h-full'>
                  <select
                    className='appearance-none bg-gray-200'
                    defaultValue={bell.time.hour}
                    onChange={event => {
                      setBells(previous => {
                        const bytes: number[] = [],
                              next = [...previous]
                        next[index].time.hour = parseInt(event.target.value, 10)
                        bytes.push(next[index].id)
                        bytes.push((next[index].time.hour & 0b0011_1111) | 0b1000_0000)
                        next.sort((first, second) => (first.time.hour * 60) + first.time.minute - (second.time.hour * 60) - second.time.minute)

                        fetch('/api/v1/timetable', {
                          body  : new Uint8ClampedArray(bytes),
                          method: 'PATCH'
                        })

                        return next
                      })
                    }}
                  >
                    {
                      [...Array(24)].map((_value, index) => <option
                        key={index}
                        value={index}
                      >
                        {index}
                      </option>)
                    }
                  </select>
                  :
                  <select
                    className='appearance-none bg-gray-200'
                    defaultValue={bell.time.minute}
                    onChange={event => {
                      setBells(previous => {
                        const bytes: number[] = [],
                              next = [...previous]
                        next[index].time.minute = parseInt(event.target.value, 10)
                        bytes.push(next[index].id)
                        bytes.push((next[index].time.minute & 0b0011_1111) | 0b1100_0000)
                        next.sort((first, second) => (first.time.hour * 60) + first.time.minute - (second.time.hour * 60) - second.time.minute)

                        fetch('/api/v1/timetable', {
                          body  : new Uint8ClampedArray(bytes),
                          method: 'PATCH'
                        })

                        return next
                      })
                    }}
                  >
                    {
                      [...Array(60)].map((_value, index) => <option
                        key={index}
                        value={index}
                      >
                        {index.toString().padStart(2, '0')}
                      </option>)
                    }
                  </select>
                </div>
                <span className='text-gray-500 font-mono text-xs'>{bell.id.toString().padStart(3, '0')}</span>
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
