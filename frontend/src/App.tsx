import { useEffect, useRef, useState } from 'react'
import AddBellButton from 'AddBellButton'
import Bell from 'Bell'
import { BellTimes } from 'BellTimes'
import CursorState from 'CursorState'
import { DateTime } from 'luxon'
import DayButtons from 'DayButtons'
import Divider from 'Divider'
import Header from 'Header'
import Plus from 'Plus'
import classNames from 'classNames'
import lerp from 'lerp'
import useStateRef from 'useStateRef'

const App = () => {
  let mousePosition = {
    xPosition: 0,
    yPosition: 0
  },
      lastMouseActivity = 0
  const addBellButton = useRef<HTMLDivElement>(null),
        cursor = useRef<HTMLDivElement>(null),
        dayButtons = useRef<HTMLDivElement>(null),
        plus = useRef<SVGSVGElement>(null),
        [ selectedDay, setSelectedDay, selectedDayRef ] = useStateRef(-1),
        [ cursorState, setCursorState ] = useState(CursorState.Normal),
        [ bellTimes, setBellTimes ] = useState<BellTimes>(Array.from({ length: 7 }, () => [])),
        mouse = (event: MouseEvent): void => {
          lastMouseActivity = Date.now()
          setCursorState(CursorState.Normal)
          if (!plus.current)
            return
          if (!cursor.current)
            return

          mousePosition = {
            xPosition: event.clientX,
            yPosition: event.clientY
          }

          if (addBellButton.current?.matches(':hover'))
            if (selectedDayRef.current === -1)
              setCursorState(CursorState.Cross)
            else
              setCursorState(CursorState.Plus)

          if (dayButtons.current?.children && Array.from(dayButtons.current?.children).some(child => child.matches(':hover')))
            setCursorState(CursorState.Light)
        }
  useEffect(() => {
    const interval = setInterval(() => {
      if (!cursor.current)
        return
      const previousX = parseFloat((cursor.current.style.left || '0px').slice(0, -2)),
            previousY = parseFloat((cursor.current.style.top || '0px').slice(0, -2)),
            targetX = mousePosition.xPosition - cursor.current.clientWidth / 2,
            targetY = mousePosition.yPosition - cursor.current.clientHeight / 2
      cursor.current.style.left = `${lerp(previousX, targetX, 0.2)}px`
      cursor.current.style.top = `${lerp(previousY, targetY, 0.2)}px`

      if (Date.now() - lastMouseActivity > 3000) {
        cursor.current.classList.add('opacity-0')
        cursor.current.classList.remove('opacity-100')
      } else {
        cursor.current.classList.add('opacity-100')
        cursor.current.classList.remove('opacity-0')
      }
    }, 5)

    document.addEventListener('mousemove', mouse)
    document.addEventListener('mousedown', mouse)
    return () => {
      clearInterval(interval)
      document.removeEventListener('mousemove', mouse)
      document.removeEventListener('mousedown', mouse)
    }
  }, [])

  return <>
    <div className='h-full bg-cinder-950 flex flex-col px-4 pt-4 gap-4 font-extrabold tracking-tighter selection:bg-gold-500 selection:text-gold-900 sm:cursor-none overflow-y-auto'>
      <Header />
      <Divider />
      <div className='flex items-center'>
        <span className='text-gold-200 leading-none text-2xl [writing-mode:vertical-lr] md:[writing-mode:horizontal-tb] md:mx-10'>
          DAYS
        </span>
        <DayButtons select={index => {
          setSelectedDay(index)
        }} ref={dayButtons} />
      </div>
      <Divider />
      <div className='flex gap-4 grow shrink-0 basis-auto'>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-gold-200 leading-none text-2xl [writing-mode:vertical-lr] md:[writing-mode:horizontal-tb] flex flex-col items-center md:py-5 md:mx-10'>
            BELLS
          </span>
          <span className='w-[3px] bg-gold-100 grow shrink-0 basis-auto rounded-t-full shadow shadow-gold-200/20'></span>
        </div>
        <div className='flex flex-col grow basis-auto shrink-0 gap-4'>
          <AddBellButton
            click={() => {
              if (selectedDay === -1)
                return
              if (bellTimes[selectedDay].length >= 20)
                return

              setBellTimes(bellTimes => {
                const localBellTimes = [...bellTimes]
                localBellTimes[selectedDay].push(DateTime.now())
                return localBellTimes
              })
            }}
            ref={addBellButton}
            disabled={selectedDay === -1}
          />
          <ul className='flex flex-col grow basis-auto shrink-0 gap-2'>
            {selectedDay === -1
              ? null
              : bellTimes[selectedDay].map((time, index) => <Bell number={index + 1} time={time} key={index} />)}
          </ul>
        </div>
      </div>
    </div>
    <div
      ref={cursor}
      className={classNames(
        'pointer-events-none hidden absolute sm:block rounded-full [transition-property:padding,color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter] duration-300 opacity-0',
        [ CursorState.Plus, CursorState.Cross ].includes(cursorState)
          ? 'p-3'
          : 'p-2',
        cursorState === CursorState.Light
          ? 'blur p-6'
          : 'backdrop-blur-sm border-t',
        cursorState === CursorState.Cross
          ? 'bg-red-500/20 border-red-500'
          : cursorState === CursorState.Light
            ? 'bg-gold-200/10 border-gold-300'
            : 'bg-gold-200/20 border-gold-300'
      )}
    >
      <svg
        width='22.9102'
        height='22.9199'
        className={classNames(
          'transition duration-300',
          [ CursorState.Plus, CursorState.Cross ].includes(cursorState)
            ? 'scale-125'
            : 'scale-0',
          cursorState === CursorState.Cross
            ? 'rotate-45'
            : ''
        )}
        ref={plus}
      >
        <g>
          <Plus fill={
            cursorState === CursorState.Cross
              ? 'fill-red-500'
              : 'fill-gold-500'
          } />
        </g>
      </svg>
    </div>
  </>
}

export default App
