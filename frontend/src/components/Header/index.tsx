import { AppContext } from "App"
import { useContext, useState } from "react"
import classNames from "utils/classNames";

const Header = () => {
  const [school, setSchool, , setShowPassword] = useContext(AppContext)
  const [focused, setFocused] = useState(false);
  const [name, setName] = useState(school.name);
  return <header className='text-center flex flex-col shrink grow-0 basis-auto items-center w-full px-4 gap-4 md:flex-row'>
    <div className="w-32">

    </div>
    <div className="flex flex-col basis-auto w-full gap-2 relative">
      <h1>Welcome to</h1>
      <span className={classNames(
        "rounded-xl p-2 w-full text-xl font-bold flex gap-4 items-center transition",
        focused ? 'bg-gray-200' : ''
      )}>
        <input
          type='text'
          placeholder="School name"
          className="bg-transparent w-full text-center"
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
          <span className="invisible">{name || 'School Name'}</span>
          <svg viewBox="0 0 16 16" width={32} height={32} className={classNames(
            focused ? 'invisible' : ''
          )}>
            <path
              d="
              M 1 15
              l 3 -1
              l 8 -8
              l -2 -2
              l -8 8
              z
              m 9.5 -11.5
              l 2 2
              l 1 -1
              a 1 1 0 0 0 0 -1
              l -1 -1
              a 1 1 0 0 0 -1 0
              z
            "
              className="fill-neutral-500"
            />
          </svg>
        </div>
      </span>
    </div>
    <div className="hidden gap-4 w-32 justify-center md:flex">
      <svg
        viewBox="0 0 16 16"
        width={32}
        height={32}
        className="cursor-pointer"
        onClick={() => {
          setShowPassword(true)
        }}
      >
        <path
          d="
              M 1 15
              l 5 0
              l 0 -1.5
              l 1.5 0
              l 0 -1.5
              l 1.5 0
              l 0 -1.5
              a 4.5 4.5 0 1 0 -3 -3
              l -5 5
              M 12.5 5
              a 1 1 0 0 1 -1 1
              a 1 1 0 0 1 -1 -1
              a 1 1 0 0 1 1 -1
              a 1 1 0 0 1 1 1
              z
              "
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
          d="
              M 1 1
              l 9 0
              l 0 14
              l -9 0
              z
              m 5.5 6
              l 6 0
              l -1.5 -1.5
              l 1 -1
              l 3.5 3.5
              l -3.5 3.5
              l -1 -1
              l 1.5 -1.5
              l -8 0
            "
          fillRule="evenodd"
          className="fill-rose-400"
        />
      </svg>
    </div>
  </header>
}

export default Header
