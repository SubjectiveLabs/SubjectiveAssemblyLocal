import { ForwardedRef, forwardRef } from 'react'
import classNames from 'classNames'

const AddBellButton = forwardRef(({ click, disabled }: { click: () => void, disabled: boolean}, ref: ForwardedRef<HTMLDivElement>) => <div
  className={classNames(
    'text-black text-center rounded-lg transition duration-300 text-center flex justify-between p-2 sm:px-4',
    disabled
      ? 'bg-gray-100'
      : 'bg-gold-100'
  )}
  onClick={click}
  ref={ref}
>
  <div className='grid place-content-center h-full'>
    <span className={classNames(
      'flex gap-1 w-full p-2 rounded transition',
      disabled
        ? 'md:group-hover:bg-gray-400/30'
        : 'md:group-hover:bg-gold-200/30'
    )}>
      <svg width='22.9102' height='22.9199' className={classNames(
        'rounded sm:hidden',
        disabled
          ? 'bg-gray'
          : 'bg-white'
      )}>
        <g>
          <path d='M5.42969 11.4648C5.42969 10.8984 5.82031 10.5176 6.37695 10.5176L10.5078 10.5176L10.5078 6.37695C10.5078 5.83008 10.8887 5.42969 11.4258 5.42969C11.9824 5.42969 12.373 5.82031 12.373 6.37695L12.373 10.5176L16.5137 10.5176C17.0703 10.5176 17.4609 10.8984 17.4609 11.4648C17.4609 12.002 17.0605 12.373 16.5137 12.373L12.373 12.373L12.373 16.5234C12.373 17.0703 11.9824 17.4609 11.4258 17.4609C10.8887 17.4609 10.5078 17.0605 10.5078 16.5234L10.5078 12.373L6.37695 12.373C5.83008 12.373 5.42969 12.002 5.42969 11.4648Z' className={classNames(
            'transition duration-300 origin-center',
            disabled
              ? 'fill-gray-500 rotate-45'
              : 'fill-gold-500'
          )} />
        </g>
      </svg>
      <h3 className={classNames(
        disabled
          ? 'text-gray-500'
          : 'text-black'
      )}>Add Bell</h3>
    </span>
  </div>
</div>)
export default AddBellButton
