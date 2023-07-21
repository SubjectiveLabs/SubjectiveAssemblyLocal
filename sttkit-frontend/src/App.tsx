import { useEffect, useRef, useState } from 'react'
import AddBellButton from 'AddBellButton'
import DayButtons from 'DayButtons'
import Divider from 'Divider'
import Header from 'Header'
import classNames from 'classNames'
import lerp from 'lerp'

enum CursorState {
  Normal,
  Plus,
  Cross,
  Light,
  Hidden
}

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
        [ cursorState, setCursorState ] = useState(CursorState.Normal),
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

          if (addBellButton.current?.matches(':hover')) {
            setCursorState(CursorState.Plus)
            plus.current.classList.add('scale-[1.5]')
            plus.current.classList.remove('scale-0')
            cursor.current.classList.add('scale-[1.5]')
            cursor.current.classList.remove('scale-100')
          } else {
            plus.current.classList.remove('scale-[1.5]')
            plus.current.classList.add('scale-0')
            cursor.current.classList.add('scale-100')
            cursor.current.classList.remove('scale-[1.5]')
          }

          if (dayButtons.current?.children && Array.from(dayButtons.current?.children).some(child => child.matches(':hover'))) {
            setCursorState(CursorState.Light)
            cursor.current.classList.add('blur-[4px]', 'scale-[1.5]', 'bg-gold-200/30')
            cursor.current.classList.remove('bg-gold-200/20', 'backdrop-blur-sm', 'border-t')
          } else {
            cursor.current.classList.add('bg-gold-200/20', 'backdrop-blur-sm', 'border-t')
            cursor.current.classList.remove('blur-[4px]', 'bg-gold-200/30')
          }
        },
        [ selected, setSelected ] = useState(-1)
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

    document.querySelector('html')?.addEventListener('mousemove', mouse)
    document.querySelector('html')?.addEventListener('mousedown', mouse)
    return () => {
      document.querySelector('html')?.removeEventListener('mousemove', mouse)
      document.querySelector('html')?.removeEventListener('mousedown', mouse)
      clearInterval(interval)
    }
  }, [])
  return <>
    <div className='h-full bg-cinder-950 flex flex-col px-4 pt-4 gap-4 font-extrabold tracking-tighter selection:bg-gold-500 selection:text-gold-900 sm:cursor-none'>
      <Header />
      <Divider />
      <div className='flex items-center'>
        <span className='text-gold-200 leading-none text-2xl [writing-mode:vertical-lr]'>
          DAYS
        </span>
        <DayButtons select={index => {
          setSelected(index)
        }} ref={dayButtons} />
      </div>
      <Divider />
      <div className='flex h-full gap-4'>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-gold-200 leading-none text-2xl [writing-mode:vertical-lr]'>
            BELLS
          </span>
          <span className='w-[3px] bg-gold-100 h-full rounded-t-full'></span>
        </div>
        <AddBellButton click={() => {
          if (selected === -1)
            return
        }} ref={addBellButton} disabled={selected === -1} />
      </div>
    </div>
    <div
      ref={cursor}
      className={classNames(
        'pointer-events-none hidden absolute sm:block rounded-full bg-gold-200/20 backdrop-blur-sm border-t border-gold-200/30 p-2 transition duration-300 opacity-0 scale-[1.5]'
      )}
    >
      <svg
        width='22.9102'
        height='22.9199'
        className={classNames(
          'transition duration-300'
        )}
        ref={plus}
      >
        <g>
          <path d='M5.42969 11.4648C5.42969 10.8984 5.82031 10.5176 6.37695 10.5176L10.5078 10.5176L10.5078 6.37695C10.5078 5.83008 10.8887 5.42969 11.4258 5.42969C11.9824 5.42969 12.373 5.82031 12.373 6.37695L12.373 10.5176L16.5137 10.5176C17.0703 10.5176 17.4609 10.8984 17.4609 11.4648C17.4609 12.002 17.0605 12.373 16.5137 12.373L12.373 12.373L12.373 16.5234C12.373 17.0703 11.9824 17.4609 11.4258 17.4609C10.8887 17.4609 10.5078 17.0605 10.5078 16.5234L10.5078 12.373L6.37695 12.373C5.83008 12.373 5.42969 12.002 5.42969 11.4648Z' className='fill-gold-500' />
        </g>
      </svg>
    </div>
  </>
}

export default App
