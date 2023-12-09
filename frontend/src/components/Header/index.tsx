import { AppContext } from "App"
import { Door, Heart, GearTooth, Pencil } from "Icons";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import classNames from "classNames";
import { Tooltip, TooltipContent, TooltipTrigger } from "components/Tooltip";
import { QrCodeIcon } from "@heroicons/react/20/solid";

const Header = ({ setShowQRCode }: { setShowQRCode: Dispatch<SetStateAction<boolean>> }) => {
  const {
    school: [school, setSchool],
    thanks,
    setShowSettings
  } = useContext(AppContext)
  const [focused, setFocused] = useState(false)
  const [name, setName] = useState(school.name)
  const input = useRef<HTMLInputElement>(null)
  const fakeText = useRef<HTMLSpanElement>(null)
  const [inputWidth, setInputWidth] = useState(fakeText.current?.clientWidth || 0)
  const [fakeTextWidth, setFakeTextWidth] = useState(fakeText.current?.clientWidth || 0)
  useEffect(() => {
    setName(school.name)
  }, [school])
  useEffect(() => {
    addEventListener('resize', () => {
      setInputWidth(input.current?.clientWidth || 0)
      setFakeTextWidth(fakeText.current?.clientWidth || 0)
    })
  }, [])
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
        <span className="text-pink-500 whitespace-nowrap">Thanks Received</span>
        <span className="text-3xl">{thanks || 0}</span>
      </div>
    </div>
    <div className="flex flex-col basis-auto w-full relative">
      <h1 className="md:text-xl">Welcome to</h1>
      <div className="flex items-center gap-4">
        <span className={classNames(
          "rounded-xl w-full text-xl font-bold flex gap-4 items-center",
          focused ? 'bg-gray-200' : ''
        )}>
          <input
            type='text'
            placeholder="School name"
            className="bg-transparent w-full text-center text-xl md:text-3xl overflow-auto pl-2"
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
            ref={input}
          />
          <div className="absolute text-center inset-x-0 flex justify-center items-center pointer-events-none gap-2 tracking-normal">
            <div className="w-8 h-8"></div>
            <span className="invisible text-xl md:text-3xl" ref={fakeText}>{name || 'School Name'}</span>
            <svg viewBox="0 0 16 16" width={24} height={24} className={classNames(
              'shrink-0 bg-gray-50',
              focused ? 'invisible' : '',
              inputWidth > fakeTextWidth ? 'visible' : 'invisible'
            )}>
              <path
                d={Pencil}
                className="fill-neutral-500"
              />
            </svg>
          </div>
        </span>
        <svg viewBox="0 0 16 16" width={24} height={24} className={classNames(
          'shrink-0 bg-gray-50',
          focused ? 'invisible' : '',
          inputWidth < fakeTextWidth ? 'visible' : 'invisible'
        )}>
          <path
            d={Pencil}
            className="fill-neutral-500"
          />
        </svg>
      </div>
    </div>
    <div className="hidden gap-4 w-72 justify-end md:flex">
      <Tooltip>
        <TooltipTrigger>
          <QrCodeIcon
            className="w-8 h-8 cursor-pointer hover:opacity-75 transition"
            onClick={() => {
              setShowQRCode(true)
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="p-2 backdrop-blur-sm bg-black/80 text-white rounded-xl font-semibold flex items-center gap-2">
            <QrCodeIcon className="w-4 h-4" />
            View QR code
          </div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <svg
            viewBox="0 0 16 16"
            width={32}
            height={32}
            className="cursor-pointer hover:opacity-75 transition fill-neutral-500"
            onClick={() => {
              setShowSettings(true)
            }}
          >
            {
              [...Array(8)].map((_, index) => <path
                d={GearTooth}
                className="origin-center"
                style={{
                  transform: `rotate(${index * 45}deg)`,
                }}
                key={index}
              />)
            }
            <circle cx={8} cy={8} r={6} />
            <circle cx={8} cy={8} r={3} className="fill-white" />
          </svg>
        </TooltipTrigger>
        <TooltipContent>
          <div className="p-2 backdrop-blur-sm bg-black/80 text-white rounded-xl font-semibold flex items-center gap-2">
            <svg
              viewBox="0 0 16 16"
              width={16}
              height={16}
              className="cursor-pointer hover:opacity-75 transition fill-white"
              onClick={() => {
                setShowSettings(true)
              }}
            >
              {
                [...Array(8)].map((_, index) => <path
                  d={GearTooth}
                  className="origin-center"
                  style={{
                    transform: `rotate(${index * 45}deg)`,
                  }}
                  key={index}
                />)
              }
              <circle cx={8} cy={8} r={6} />
              <circle cx={8} cy={8} r={3} className="fill-black/80" />
            </svg>
            Open settings
          </div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
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
        </TooltipTrigger>
        <TooltipContent>
          <div className="p-2 backdrop-blur-sm bg-black/80 text-white rounded-xl font-semibold flex items-center gap-2">
            <svg viewBox='0 0 16 16' width={16} height={16}>
              <path
                d={Door}
                className='fill-white'
                fillRule="evenodd"
              />
            </svg>
            Log out
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  </header>
}

export default Header
