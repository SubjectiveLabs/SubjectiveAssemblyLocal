import { AppContext } from "App"
import { useContext } from "react"

const Header = () => {
  const [school, setSchool] = useContext(AppContext)
  return <header className='text-center flex flex-col shrink grow-0 basis-auto items-center'>
    <h1>Welcome to</h1>
    <input
      type='text'
      className='bg-gray-200 rounded-xl p-2 w-1/2 text-center text-xl font-bold'
      onBlur={event => {
        setSchool(previous => {
          const next = { ...previous }
          next.name = event.target.value
          return next
        })
      }}
      defaultValue={school.name}
    />
  </header>
}

export default Header
