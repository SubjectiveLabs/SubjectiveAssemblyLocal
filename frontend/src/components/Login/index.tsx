import { Clock } from "react-svg-spinners"
import classNames from "classNames"
import { useState } from "react"

const Login = ({ show, inProgress, login }: { show: boolean, inProgress: boolean, login: (password: string) => void }) => {
  const [password, setPassword] = useState<string>('')
  return <div className={classNames(
    'w-full h-full absolute top-0 left-0 z-20 backdrop-blur-3xl grid place-content-center transition duration-1000',
    show ? '' : 'opacity-0 pointer-events-none'
  )}>
    <div className='p-8 bg-white border rounded-2xl shadow-xl flex flex-col gap-4'>
      <div>
        <h1 className='text-2xl'>Log In to Assembly</h1>
      </div>
      <input
        type="password"
        placeholder='Enter your password'
        className='border rounded-lg p-2'
        onInput={event => {
          setPassword(event.currentTarget.value)
        }}
      />
      <button
        className={classNames(
          'bg-black text-white rounded-full p-2 flex items-center justify-center gap-2',
          password && !inProgress ? '' : 'opacity-50 pointer-events-none'
        )}
        onClick={() => {
          if (password && !inProgress)
            login(password)
        }}
      >
        Login
        {inProgress && <Clock color='white' className='inline' />}
      </button>
    </div>
  </div>
}

export default Login