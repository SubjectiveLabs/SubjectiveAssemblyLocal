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
  return <div className='text-gold-100 flex justify-between grow shrink-0 basis-auto ps-4' ref={ref}>
    {daysShort.map((day, index) => <span
      key={day}
      className={classNames(
        'border-[3px] rounded-full w-10 md:w-auto p-2 h-10 flex justify-center items-center border-gold-200 transition duration-300 hover:scale-[1.1] shadow-lg shadow-gold-200/10',
        selected === index
          ? 'bg-gold-200 text-cinder-950'
          : 'hover:bg-gold-200 hover:text-cinder-950'
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
