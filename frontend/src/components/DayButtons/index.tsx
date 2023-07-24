import { ForwardedRef, forwardRef, useState } from 'react'
import classNames from 'classNames'

const DayButtons = forwardRef(({ select }: {select: (index: number) => void}, ref: ForwardedRef<HTMLDivElement>) => {
  const dayEndings = [
    'onday',
    'esday',
    'ednesday',
    'ursday',
    'riday',
    'turday',
    'nday'
  ],
        daysShort = [
          'M',
          'Tu',
          'W',
          'Th',
          'F',
          'Sa',
          'Su'
        ],
        [ selected, setSelected ] = useState(-1)
  return <div className='text-lg text-gold-100 flex justify-between grow shrink-0 basis-auto' ref={ref}>
    {daysShort.map((day, index) => <span
      key={day}
      className={classNames(
        'rounded-xl w-10 md:w-screen p-2 mr-4 h-30 flex justify-center items-center border-none transition duration-300 hover:scale-[1.1] text-black shadow-gold-200/10',
        selected === index
          ? 'bg-gold-500 hover:bg-gold-300'
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
