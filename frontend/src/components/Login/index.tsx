import classNames from "classNames"
import { useContext, useState } from "react"
import { AppContext } from "App"

const Login = ({ show, inProgress, login }: { show: boolean, inProgress: boolean, login: (password: string) => Promise<boolean> }) => {
  const [password, setPassword] = useState<string>(''),
    [incorrect, setIncorrect] = useState(false),
    [school,] = useContext(AppContext)
  return <div className={classNames(
    'w-full h-full absolute top-0 left-0 z-20 backdrop-blur-3xl grid place-content-center transition duration-1000',
    show ? '' : 'opacity-0 pointer-events-none'
  )}>
    <div className='p-8 bg-white border rounded-2xl shadow-xl flex flex-col gap-4'>
      <div>
        <h1 className='text-2xl'>Log in to {school.name}{school.name && "'s"} Assembly</h1>
      </div>
      <div className="flex flex-col">
        <span className={classNames(
          'text-red-500 transition duration-1000 text-sm text-center',
          incorrect ? '' : 'opacity-0 pointer-events-none'
        )}>
          Incorrect password.
        </span>
        <input
          type="password"
          placeholder='Enter your password'
          className={classNames(
            'border rounded-lg p-2',
            !password || inProgress || incorrect ? 'border-red-500 bg-red-100' : ''
          )}
          onInput={event => {
            setPassword(event.currentTarget.value)
            setIncorrect(false)
          }}
        />
      </div>
      <button
        className={classNames(
          'bg-black text-white rounded-full p-2 flex items-center justify-center gap-2',
          password && !inProgress && !incorrect ? '' : 'opacity-50 pointer-events-none'
        )}
        onClick={() => {
          if (password && !inProgress && !incorrect)
            login(password).then(correct => {
              setIncorrect(!correct)
            })
        }}
      >
        Log in
        {inProgress && <img src="/app/loader.gif" />}
      </button>
    </div>
  </div>
}

export default Login
