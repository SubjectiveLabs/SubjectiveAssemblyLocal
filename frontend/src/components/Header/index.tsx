import { AppContext } from "App"
import { Door, Heart, Key, Pencil } from "Icons";
import { useContext, useEffect, useState } from "react"
import classNames from "classNames";

const Header = () => {
  // const [school, setSchool, , thanks, setShowSettings] = useContext(AppContext)
  const {
    school: [school, setSchool],
    thanks,
    setShowSettings
  } = useContext(AppContext)
  const [focused, setFocused] = useState(false);
  const [name, setName] = useState(school.name);
  useEffect(() => {
    setName(school.name)
  }, [school])
  return <header className='text-center flex flex-col shrink grow-0 basis-auto items-center w-full px-4 gap-x-4 md:flex-row'>
    <div className="w-72 hidden md:flex gap-2">
      <svg width={24} height={24} viewBox="0 0 16 16">
        <circle cx={8} cy={8} r={8} className='fill-white' />
        <path
          d={Heart}
          className="fill-pink-500"
        />
      </svg>
      <div className="flex flex-col text-left text-xl">
        <span className="text-pink-500 whitespace-nowrap">Thanks Recieved</span>
        <span className="text-3xl">{thanks || 0}</span>
      </div>
    </div>
    <div className="flex flex-col basis-auto w-full relative">
      <h1 className="md:text-xl">Welcome to</h1>
      <span className={classNames(
        "rounded-xl pl-1 w-full text-xl font-bold flex gap-x-4 items-center transition",
        focused ? 'bg-gray-200' : ''
      )}>
        <input
          type='text'
          placeholder="School name"
          className="bg-transparent w-full text-center text-xl md:text-3xl"
          onFocus={() => {
            setFocused(true)
          }}
          onBlur={event => {
            setFocused(false)
            setSchool(previous => {
              const next = { ...previous }
              next.name = event.target.value
              return next
            })
          }}
          onChange={event => {
            setName(event.target.value)
          }}
          defaultValue={school.name}
        />
        <div className="absolute text-center inset-x-0 flex justify-center items-center pointer-events-none gap-2 tracking-normal">
          <div className="w-8 h-8"></div>
          <span className="invisible text-xl md:text-3xl">{name || 'School Name'}</span>
          <svg viewBox="0 0 16 16" width={24} height={24} className={classNames(
            'shrink-0 bg-white',
            focused ? 'invisible' : ''
          )}>
            <path
              d={Pencil}
              className="fill-neutral-500"
            />
          </svg>
        </div>
      </span>
    </div>
    <div className="hidden gap-4 w-72 justify-end md:flex">
      <svg
        viewBox="0 0 16 16"
        width={32}
        height={32}
        className="cursor-pointer hover:opacity-75 transition"
        onClick={() => {
          setShowSettings(true)
        }}
      >
        <path
          d={Key}
          className="fill-neutral-500"
        />
      </svg>
      <svg
        viewBox="0 0 16 16"
        width={32}
        height={32}
        className="cursor-pointer hover:opacity-75 transition"
        onClick={location.reload.bind(location)}
      >
        <path
          d={Door}
          fillRule="evenodd"
          className="fill-red-500"
        />
      </svg>
    </div>
  </header>
}

export default Header
