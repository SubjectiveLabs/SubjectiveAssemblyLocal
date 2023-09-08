import { AppContext } from "App"
import Alert from "components/Alert"
import { useContext } from "react"

const Header = () => {
  const [school, setSchool, , thanks] = useContext(AppContext)
  return <header className="grid grid-cols-2 md:grid-cols-3">
    <div className="grid place-content-center">
      <Alert
        text={
          <div className="flex gap-2">
            <span>Thanks</span>
            <span>{thanks}</span>
          </div>
        }
        show={!!thanks || (import.meta as unknown as { env: { DEV: boolean } }).env.DEV}
        colour="bg-rose-400"
        icon={<svg width={16} height={16} viewBox="0 0 16 16">
          <circle cx={8} cy={8} r={8} className='fill-white' />
          <path
            d="
              M 8 13.333
              a 0.666 0.666 0 0 1 -0.291 -0.066
              C 7.476 13.153 2 10.447 2 6
              a 3.333 3.333 0 0 1 5.69 -2.357
              l 0.31 0.31 0.31 -0.31
              A 3.333 3.333 0 0 1 14 6
              c 0 4.431 -5.475 7.152 -5.708 7.27
              A 0.666 0.666 0 0 1 8 13.333
              z
            "
            className="fill-rose-400"
          />
        </svg>}
      />
    </div>
    <div className="text-center flex flex-col items-center px-4">
      <h1>Welcome to</h1>
      <input
        type='text'
        className='bg-gray-200 rounded-xl p-2 w-full text-center text-xl font-bold'
        onBlur={event => {
          setSchool(previous => {
            const next = { ...previous }
            next.name = event.target.value
            return next
          })
        }}
        defaultValue={school.name}
      />
    </div>
  </header>
}

export default Header
