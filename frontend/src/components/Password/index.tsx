import { Clock } from "react-svg-spinners"
import classNames from "classNames"
import { useState } from "react"

const Password = ({ show, inProgress, putPassword }: { show: boolean, inProgress: boolean, putPassword: (previous: string, next: string) => void }) => {
  const [password, setPassword] = useState<string>('')
  return <div className={classNames(
    'w-full h-full absolute top-0 left-0 z-20 backdrop-blur-3xl grid place-content-center transition duration-1000',
    show ? '' : 'opacity-0 pointer-events-none'
  )}>
    <div className='p-8 bg-white border rounded-2xl shadow-xl flex flex-col gap-4'>
      <div>
        <h1 className='text-2xl'>No password set.</h1>
        <p>Secure student bell times with a strong password.</p>
        <p>You won't be able to see this again, so keep it safe.</p>
      </div>
      <input
        type="password"
        placeholder='Set a password'
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
            putPassword('', password)
        }}
      >
        Set Password
        {inProgress && <Clock color='white' className='inline' />}
      </button>
    </div>
  </div>
}

export default Password
