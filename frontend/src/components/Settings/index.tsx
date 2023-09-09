import { AppContext } from "App"
import classNames from "classNames"
import { Duration } from "luxon"
import { useContext, useState } from "react"

const Settings = ({ show, inProgress, putPassword }: { show: boolean, inProgress: boolean, putPassword: (next: string) => void }) => {
  const [password, setPassword] = useState<string>('')
  const {
    autoRefresh: [autoRefresh, setAutoRefresh],
    refreshInterval: [refreshInterval, setRefreshInterval]
  } = useContext(AppContext)
  return <div className={classNames(
    'w-full h-full absolute top-0 left-0 z-20 backdrop-blur-3xl grid place-content-center transition duration-1000',
    show ? '' : 'opacity-0 pointer-events-none'
  )}>
    <div className='p-8 bg-white border rounded-2xl shadow-xl flex flex-col gap-4'>
      <h1 className='text-2xl'>Settings</h1>
      <div className="gap-2 flex flex-col">
        <h2 className="leading-none text-xl">Authentication</h2>
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
              putPassword(password)
          }}
        >
          Set Password
          {inProgress && <img src="/app/loader.gif" className="w-8 h-8" />}
        </button>
      </div>
      <div className="gap-2 flex flex-col">
        <h2 className="leading-none text-xl">Auto-refresh</h2>
        <div className="flex items-center gap-4 justify-between">
          <label>
            Enable auto-refresh
          </label>
          <input
            type="checkbox"
            defaultChecked={autoRefresh}
            onChange={event => {
              setAutoRefresh(event.currentTarget.checked)
            }}
          />
        </div>
        <div className="flex items-center gap-4 justify-between">
          <label>
            Interval
          </label>
          <input
            type="number"
            min={1}
            max={1440}
            defaultValue={refreshInterval.as('minutes')}
            disabled={!autoRefresh}
            className={classNames(
              autoRefresh ? '' : 'text-neutral-400 pointer-events-none',
            )}
            onChange={event => {
              let minutes = parseInt(event.currentTarget.value) || 0
              if (minutes < 1)
                minutes = 1
              if (minutes > 1440)
                minutes = 1440
              event.currentTarget.value = minutes.toString()
              setRefreshInterval(Duration.fromObject({ minutes: parseInt(event.currentTarget.value) }))
            }}
          />
        </div>
        <p className="text-neutral-500 text-xs">
          {
            autoRefresh
              ? `Assembly will automatically refresh every ${refreshInterval.normalize().toHuman({
                listStyle: 'long',
                unitDisplay: 'long',
              })}.`
              : "Assembly won't automatically refresh."
          }
        </p>
      </div>
    </div>
  </div>
}

export default Settings
