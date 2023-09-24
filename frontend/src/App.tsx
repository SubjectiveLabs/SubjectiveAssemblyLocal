import { Dispatch, SetStateAction, createContext, useContext, useEffect, useRef, useState } from 'react'
import BellIcon from 'components/Bell'
import Footer from 'Footer'
import { v4 } from 'uuid'
import classNames from 'utils/classNames'
import Alert from 'Alert'
import { Door, Exclamation, Heart, Key, Pages, Plus } from 'components/Icons'
import Loading from 'Loading'
import Password from 'Password'
import Login from 'Login'
import { Agent, AgentContext, BellTime, Notice, School } from 'backend'
import Header from 'components/Header'
import Link from 'components/Link'
import Settings from 'components/Settings'
import { Duration } from 'luxon'
import Message from 'components/Message'
import Bell from 'components/Bell'

export type Context = {
  school: [School, Dispatch<SetStateAction<School>>],
  password: string,
  thanks: number,
  setShowSettings: Dispatch<SetStateAction<boolean>>,
  autoRefresh: [boolean, Dispatch<SetStateAction<boolean>>],
  refreshInterval: [Duration, Dispatch<SetStateAction<Duration>>],
}

export const AppContext = createContext<Context>({} as Context)
export const env = (import.meta as unknown as { env: { PROD: boolean, DEV: boolean } }).env
const App = () => {
  const getDefaultDay = () => {
    let day = new Date().getDay() - 1
    if (day === -1)
      day = 0
    if (day === 5)
      day = 4
    return day
  },
    [school, setSchool]: [School, Dispatch<SetStateAction<School>>] = useState<School>({ name: "", bellTimes: [[], [], [], [], []], links: [], notices: [], userCreated: false }),
    [day, setDay] = useState(getDefaultDay()),
    [active, setActive] = useState(0),
    [updateFailed, setUpdateFailed] = useState(false),
    [loading, setLoading] = useState(true),
    [loadingItems, setLoadingItems] = useState<string[]>([]),
    [showPassword, setShowPassword] = useState(false),
    [waitingForPassword, setWaitingForPassword] = useState(false),
    [showLogin, setShowLogin] = useState(false),
    [waitingForLogin, setWaitingForLogin] = useState(false),
    [password, setPassword] = useState(' '),
    [thanks, setThanks] = useState(0),
    [showSettings, setShowSettings] = useState(false),
    scroll = useRef<HTMLDivElement>(null),
    agent = useContext(AgentContext) as Agent,
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    addLoadingItem = (item: string) => {
      setLoadingItems(previous => {
        const next = [...previous]
        next.push(item)
        return next
      })
    },
    update = () => {
      setUpdateFailed(false)
      agent.getThanks().then(thanks => {
        setThanks(thanks)
      }).catch(() => {
        setUpdateFailed(true)
      })
      agent.getSchool().then(school => {
        setSchool(school)
      }).catch(() => {
        setUpdateFailed(true)
      })
    },
    [autoRefresh, setAutoRefresh] = useState(true),
    [refreshInterval, setRefreshInterval] = useState(Duration.fromObject({ minutes: 60 })),
    [cloneFrom, setCloneFrom] = useState(
      (
        [...Array(days.length)]
          .map((_, index) => index)
          .filter(index => index != day && school.bellTimes[index].length > 0)
      )[Math.floor(Math.random() * (days.length - 1))]
    ),
    [hoverClone, setHoverClone] = useState(false)
  useEffect(update, [day])
  useEffect(() => {
    agent.putSchool(school, password)
  }, [school])
  useEffect(() => {
    {
      setInterval(() => {
        if (autoRefresh)
          update()
      }, refreshInterval.as('milliseconds'))
    }
    (async () => {
      addLoadingItem('Getting "thanks" count...')
      setThanks(await agent.getThanks())
      addLoadingItem('Done.')
      addLoadingItem('Checking for password...')
      const [exists,] = await agent.getPassword(' ')
      if (exists) {
        addLoadingItem('Password set. Authenticating...')
        setShowLogin(true)
      } else {
        addLoadingItem('Password not set. Prompting user...')
        setShowPassword(true)
      }
    })()
  }, [])
  return <AppContext.Provider value={{
    school: [school, setSchool],
    password,
    thanks,
    setShowSettings,
    autoRefresh: [autoRefresh, setAutoRefresh],
    refreshInterval: [refreshInterval, setRefreshInterval],
  }}>
    <div className='py-4 bg-gray-50 h-full flex flex-col gap-2 font-semibold tracking-tighter leading-none md:pb-0'>
      <Header />
      <div className='flex h-full overflow-x-auto overflow-y-hidden snap-mandatory snap-x scroll-smooth md:p-4 md:grid md:grid-cols-3 md:gap-4 no-scrollbar' onScroll={event => {
        const scroll = event.currentTarget.scrollLeft / event.currentTarget.scrollWidth * 3
        if (Math.abs(scroll - Math.round(scroll)) < 20)
          setActive(Math.round(scroll))
      }} ref={scroll}>
        <div className='md:border md:shadow-lg md:rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
          <div className='gap-2 items-center flex text-xl'>
            <span className='bg-black w-4 h-4 inline-flex rotate-45'></span>
            Bell Times
          </div>
          <div className='flex gap-2 justify-between pb-2 flex-col'>
            <span className={classNames('flex items-center gap-2 justify-between flex-wrap',
              updateFailed && env.PROD
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
                className='bg-black text-white flex p-2 gap-2 items-center rounded-full whitespace-nowrap grow shrink-0 basis-auto'
                onClick={(updateFailed && env.PROD) ? undefined : () => {
                  const bellTime: BellTime = {
                    id: v4(),
                    name: 'New Bell',
                    hour: Math.floor(Math.random() * 24),
                    minute: Math.floor(Math.random() * 60),
                    enabled: true,
                    userCreated: false,
                  }
                  setSchool(previous => {
                    const next = { ...previous }
                    next.bellTimes[day].push(bellTime)
                    return next
                  })
                }}
              >
                <svg viewBox='0 0 16 16' width={16} height={16}>
                  <circle cx={8} cy={8} r={8} className='fill-white' />
                  <path d={Plus} />
                </svg>
                Add Bell
              </button>
              {days
                .map((day, index) => [day, index])
                .filter((_, index) => index != day && school.bellTimes[index].length > 0).length > 0 && <button
                  className='bg-black text-white flex p-1 px-2 gap-2 items-center rounded-full whitespace-nowrap grow shrink-0 basis-auto'
                  onClick={(updateFailed && env.PROD) ? undefined : () => {
                    setSchool(previous => {
                      const next = { ...previous }
                      next.bellTimes[day] = [...next.bellTimes[day], ...next.bellTimes[cloneFrom].map(period => {
                        const next = { ...period }
                        next.id = v4()
                        return next
                      })]
                      return next
                    })
                  }}
                  onMouseEnter={() => {
                    setHoverClone(true)
                  }}
                  onMouseLeave={() => {
                    setHoverClone(false)
                  }}
                >
                  <svg viewBox='0 0 16 16' width={16} height={16}>
                    <circle cx={8} cy={8} r={8} className='fill-white' />
                    <path d={Pages} className='stroke-black stroke-2 fill-none scale-75 origin-center' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                  Clone from
                  <select
                    className='text-black appearance-none bg-white p-1 rounded-lg'
                    defaultValue={cloneFrom}
                    onChange={event => {
                      setCloneFrom(parseInt(event.target.value, 10))
                    }}
                    onClick={event => {
                      event.stopPropagation()
                    }}
                  >
                    {
                      days
                        .map((day, index) => [day, index])
                        .filter((_, index) => index != day && school.bellTimes[index].length > 0)
                        .map(([day, index]) => <option
                          key={index}
                          value={index}
                        >
                          {day}
                        </option>)
                    }
                  </select>
                </button>}
            </span>
            <span className='flex gap-2 flex-wrap whitespace-nowrap'>
              <Alert
                text={`No bells found for ${days[day]}.`}
                show={school.bellTimes[day].length === 0}
                colour='bg-red-500'
                icon={<Exclamation />}
              />
            </span>
          </div>
          <ul className='flex flex-col gap-4 rounded-2xl overflow-y-auto'>
            {
              school.bellTimes[day].map(bell => <BellIcon
                key={bell.id}
                bellTime={bell}
              />)
            }
            {
              school.bellTimes[cloneFrom]?.map(bell => <div className={classNames(
                'pointer-events-none transition duration-500',
                hoverClone
                  ? 'opacity-50'
                  : 'opacity-0'
              )}>
                <Bell
                  key={bell.id}
                  bellTime={bell}
                />
              </div>)
            }
          </ul>
        </div>
        <div className='md:border md:shadow-lg md:rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
          <div className='gap-2 items-center flex text-xl'>
            <span className='w-6 h-6 inline-flex border-[6px] border-black rounded-full'></span>
            Links
          </div>
          <div className='flex gap-2 justify-between pb-2 flex-col'>
            <button
              className={classNames(
                'bg-black text-white flex p-2 gap-2 items-center rounded-full whitespace-nowrap',
                updateFailed && env.PROD
                  ? 'opacity-50 pointer-events-none'
                  : ''
              )}
              onClick={(updateFailed && env.PROD) ? undefined : () => {
                const link = {
                  id: v4(),
                  title: 'New Link',
                  destination: 'https://example.com',
                  icon: 'link',
                }
                setSchool(previous => {
                  const next = { ...previous }
                  next.links.push(link)
                  return next
                })
              }}
            >
              <svg viewBox='0 0 16 16' width={16} height={16}>
                <circle cx={8} cy={8} r={8} className='fill-white' />
                <path d={Plus} />
              </svg>
              Add Link
            </button>
          </div>
          <ul className='flex flex-col gap-4 rounded-2xl overflow-y-auto'>
            {
              school.links.map(link => <Link link={link} />)
            }
          </ul>
        </div>
        <div className='md:border md:shadow-lg md:rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
          <div className='gap-2 items-center flex text-xl'>
            <span className='w-6 h-6 inline-flex bg-black rounded-full rounded-bl-none'></span>
            Notices
          </div>
          <div className='flex gap-2 justify-between pb-2 flex-col'>
            <button
              className={classNames(
                'bg-black text-white flex p-2 gap-2 items-center rounded-full whitespace-nowrap',
                updateFailed && env.PROD
                  ? 'opacity-50 pointer-events-none'
                  : ''
              )}
              onClick={(updateFailed && env.PROD) ? undefined : () => {
                const priority = Math.random() > 0.5
                const notice: Notice = {
                  id: v4(),
                  title: 'New Notice',
                  content: priority ? 'This is an important new notice.' : 'This is a new notice.',
                  priority,
                }
                setSchool(previous => {
                  const next = { ...previous }
                  next.notices.push(notice)
                  return next
                })
              }}
            >
              <svg viewBox='0 0 16 16' width={16} height={16}>
                <circle cx={8} cy={8} r={8} className='fill-white' />
                <path d={Plus} />
              </svg>
              Add Notice
            </button>
          </div>
          <ul className='flex flex-col gap-4 rounded-2xl overflow-y-auto'>
            {
              school.notices.map(notice => <Message notice={notice} key={notice.id} />)
            }
          </ul>
        </div>
        <div className='md:border md:shadow-lg md:rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white md:hidden'>
          <div className='gap-2 items-center flex text-xl'>
            <span className='w-4 h-4 inline-flex flex-col gap-1'>
              {
                [...Array(3)].map((_, index) => <span className='bg-black grow rounded-full' key={index}></span>)
              }
            </span>
            Menu
          </div>
          <div className='bg-pink-500 p-4 text-white rounded-xl flex gap-4 items-center'>
            <svg width={72} height={72} viewBox="0 0 16 16">
              <path
                d={Heart}
                className="fill-white"
              />
            </svg>
            <div className='flex flex-col'>
              <span className='text-4xl font-extrabold'>{thanks || 0}</span>
              <span className='text-xl'>thanks recieved.</span>
            </div>
          </div>
          <button
            className='p-4 shadow-lg border rounded-xl flex gap-2 items-center'
            onClick={() => {
              setShowSettings(true)
            }}
          >
            <svg
              viewBox="0 0 16 16"
              width={32}
              height={32}
              className="bg-black rounded-xl p-2"
            >
              <path
                d={Key}
                className="fill-white"
              />
            </svg>
            Change Password
          </button>
          <button
            className='p-4 shadow-lg border rounded-xl flex gap-2 items-center text-red-500'
            onClick={location.reload.bind(location)}
          >
            <svg
              viewBox="0 0 16 16"
              width={32}
              height={32}
              className='bg-red-500 rounded-xl p-2'
            >
              <path
                d={Door}
                fillRule="evenodd"
                className="fill-white"
              />
            </svg>
            Log Out
          </button>
        </div>
        <div className='shrink grow-0 basis-auto md:hidden'>
          <Footer active={active} select={index => {
            scroll.current?.children[index].scrollIntoView()
          }} />
        </div>
      </div>
      <Loading show={loading && env.PROD} items={loadingItems} />
      <Password show={showPassword && env.PROD} inProgress={waitingForPassword} putPassword={next => {
        setWaitingForPassword(true)
        agent.putPassword(password, next).then(() => {
          setShowPassword(false)
          setWaitingForPassword(false)
          setPassword(next)
          addLoadingItem('Password set.')
          setLoading(false)
        })
      }} />
      <Settings show={showSettings && env.PROD} inProgress={waitingForPassword} putPassword={next => {
        setWaitingForPassword(true)
        agent.putPassword(password, next).then(() => {
          setShowPassword(false)
          setWaitingForPassword(false)
          setPassword(next)
          addLoadingItem('Password set.')
          setLoading(false)
        })
      }} />
      <Login show={showLogin && env.PROD} inProgress={waitingForLogin} login={async password => {
        setWaitingForLogin(true)
        setPassword(password)
        const [, correct] = await agent.getPassword(password)
        if (correct) {
          addLoadingItem('Password set.')
          setLoading(false)
          setShowLogin(false)
        } else {
          addLoadingItem('Wrong password.')
        }
        setWaitingForLogin(false)
        return correct
      }} />
    </div>
  </AppContext.Provider>
}

export default App
