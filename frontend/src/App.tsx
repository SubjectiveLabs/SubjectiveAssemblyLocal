import { Dispatch, SetStateAction, createContext, useContext, useEffect, useRef, useState } from 'react'
import Bell from 'Bell'
import Footer from 'Footer'
import { v4 } from 'uuid'
import classNames from 'utils/classNames'
import Alert from 'Alert'
import { Exclamation, Plus, ThreeDots } from 'components/Icons'
import Loading from 'Loading'
import Password from 'Password'
import Login from 'Login'
import { Agent, AgentContext, School } from 'backend'
import Header from 'components/Header'
import Link from 'components/Link'

export const AppContext = createContext<[School, Dispatch<SetStateAction<School>>, string, Dispatch<SetStateAction<boolean>>]>
  ({} as [School, Dispatch<SetStateAction<School>>, string, Dispatch<SetStateAction<boolean>>])
const App = () => {
  const getDefaultDay = () => {
    let day = new Date().getDay() - 1
    if (day === -1)
      day = 0
    if (day === 5)
      day = 4
    return day
  },
    [school, setSchool]: [School, Dispatch<SetStateAction<School>>] = useState<School>({ name: "", bell_times: [[], [], [], [], []], links: [] }),
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
    scroll = useRef<HTMLDivElement>(null),
    agent = useContext(AgentContext) as Agent,
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    env = (import.meta as unknown as { env: { PROD: boolean } }).env,
    addLoadingItem = (item: string) => {
      setLoadingItems(previous => {
        const next = [...previous]
        next.push(item)
        return next
      })
    },
    update = () => {
      setUpdateFailed(false)
      agent.getSchool().then(school => {
        setSchool(school)
      }).catch(() => {
        setUpdateFailed(true)
      })
    }
  useEffect(update, [day])
  useEffect(() => {
    agent.putSchool(school, password)
  }, [school])
  useEffect(() => {
    addLoadingItem('Getting notices...')
    addLoadingItem('Done.')
    addLoadingItem('Checking for password...')
    agent.getPassword(' ')
      .then(([exists,]) => {
        if (exists) {
          addLoadingItem('Password set. Authenticating...')
          setShowLogin(true)
        } else {
          addLoadingItem('Password not set. Prompting user...')
          setShowPassword(true)
        }
      })
  }, [])
  return <AppContext.Provider value={[school, setSchool, password, setShowPassword]}>
    <div className='py-4 bg-gray-50 h-full flex flex-col gap-4 font-semibold tracking-tighter leading-none md:pb-0 divide-y divide-neutral-400'>
      <Header />
      <div className='flex h-full overflow-x-auto snap-mandatory snap-x scroll-smooth md:p-4 md:grid md:grid-cols-2 md:gap-4 no-scrollbar' onScroll={event => {
        const scroll = event.currentTarget.scrollLeft / event.currentTarget.scrollWidth * 2
        if (Math.abs(scroll - Math.round(scroll)) < 10)
          setActive(Math.round(scroll))
      }} ref={scroll}>
        <div className='md:border md:shadow-lg md:rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full snap-center bg-white'>
          <div className='gap-2 items-center flex text-xl'>
            <span className='bg-black w-4 h-4 inline-flex rotate-45'></span>
            Bell Times
          </div>
          <div className='flex gap-2 justify-between border-b pb-2 flex-col border-neutral-400'>
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
                className={classNames(
                  'bg-black text-white flex p-2 gap-2 items-center rounded-full whitespace-nowrap grow shrink-0 basis-auto',
                )}
                onClick={(updateFailed && env.PROD) ? undefined : () => {
                  const period = {
                    id: v4(),
                    name: 'New Bell',
                    hour: Math.floor(Math.random() * 24),
                    minute: Math.floor(Math.random() * 60),
                  }
                  setSchool(previous => {
                    const next = { ...previous }
                    next.bell_times[day].push(period)
                    return next
                  })
                }}
              >
                <Plus />
                Add Bell
              </button>
            </span>
            <span className='flex gap-2 flex-wrap whitespace-nowrap'>
              <Alert
                text={`No bells found for ${days[day]}.`}
                show={school.bell_times[day].length === 0}
                colour='bg-rose-400'
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
              school.bell_times[day].map(period => <Bell
                key={period.id}
                bellTime={period}
              />)
            }
          </ul>
        </div>
        <div className="grow shrink-0 basis-auto snap-center flex flex-col gap-4 w-full">
          <div className='md:border md:shadow-lg md:rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2 w-full bg-white overflow-auto'>
            <div className='gap-2 items-center flex text-xl'>
              <span className='w-6 h-6 inline-flex border-[6px] border-black rounded-full'></span>
              Links
            </div>
            <div className='flex gap-2 justify-between border-b pb-2 flex-col border-neutral-400'>
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
                <Plus />
                Add Link
              </button>
            </div>
            <ul className='flex flex-col gap-4 overflow-y-auto rounded-2xl'>
              {
                school.links.map(link => <Link link={link} />)
              }
            </ul>
          </div>
        </div>
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
  </AppContext.Provider>
}

export default App
