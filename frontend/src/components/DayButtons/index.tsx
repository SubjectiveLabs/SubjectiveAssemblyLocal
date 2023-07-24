import { ForwardedRef, forwardRef, useState } from 'react'
import classNames from 'classNames'

const DayButtons = forwardRef(({ select }: {select: (index: number) => void}, ref: ForwardedRef<HTMLDivElement>) => {
  const dayEndings = [
    'day',
    'sday',
    'nesday',
    'rsday',
    'day',
    'urday',
    'day'
  ],
        daysShort = [
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun'
        ],
        [ selected, setSelected ] = useState(-1)
  return <div className='text-lg font-semibold flex justify-between grow shrink-0 basis-auto' ref={ref}>
    {daysShort.map((day, index) => <span
      key={day}
      className={classNames(
        'rounded-xl w-32 md:w-40 p-2 mr-4 h-30 flex justify-center items-center border-none transition duration-300 hover:scale-[1.1] shadow-gold-200/10',
        selected === index
          ? 'bg-gold-500 hover:bg-gold-400'
          : 'hover:bg-gold-300 bg-gold-200 '
      )}
      onClick={() => {
        setSelected(index)
        select(index)
      }}
    >
      {day}
      <span className='hidden md:inline'>{dayEndings[index]}</span>
    </span>)}
  </div>
})
export default DayButtons
