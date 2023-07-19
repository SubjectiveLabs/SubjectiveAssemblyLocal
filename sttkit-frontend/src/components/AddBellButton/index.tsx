import { ForwardedRef, forwardRef } from 'react'

const AddBellButton = forwardRef(({ click }: { click: () => void}, ref: ForwardedRef<HTMLDivElement>) => <div className='flex flex-col grow relative w-full h-16 group' onClick={click} ref={ref}>
  <svg viewBox='0 0 300 100' preserveAspectRatio='none' className='absolute top-0 left-0 h-full w-full p-px'>
    <rect
      width={300}
      height={100}
      rx='10'
      ry='10'
      vectorEffect='non-scaling-stroke'
      className='fill-none stroke-gold-200 stroke-1 [stroke-dasharray:8] [stroke-linecap:round] sm:hidden'
    />
  </svg>
  <svg viewBox='0 0 700 100' preserveAspectRatio='none' className='absolute top-0 left-0 h-full w-full p-px'>
    <rect
      width={700}
      height={100}
      rx='10'
      ry='10'
      vectorEffect='non-scaling-stroke'
      className='fill-none stroke-gold-200 stroke-1 [stroke-dasharray:8] [stroke-linecap:round] hidden sm:block md:hidden'
    />
  </svg>
  <svg viewBox='0 0 1000 100' preserveAspectRatio='none' className='absolute top-0 left-0 h-full w-full p-px'>
    <rect
      width={1000}
      height={100}
      rx='10'
      ry='10'
      vectorEffect='non-scaling-stroke'
      className='fill-none stroke-gold-200 stroke-1 [stroke-dasharray:8] [stroke-linecap:round] hidden md:block'
    />
  </svg>
  <div className='grid place-content-center h-full'>
    <span className='flex gap-1 group-hover:bg-gold-200/30 w-full p-2 rounded transition'>
      <svg width='22.9102' height='22.9199' className='rounded bg-gold-200/50 sm:hidden'>
        <g>
          <path d='M5.42969 11.4648C5.42969 10.8984 5.82031 10.5176 6.37695 10.5176L10.5078 10.5176L10.5078 6.37695C10.5078 5.83008 10.8887 5.42969 11.4258 5.42969C11.9824 5.42969 12.373 5.82031 12.373 6.37695L12.373 10.5176L16.5137 10.5176C17.0703 10.5176 17.4609 10.8984 17.4609 11.4648C17.4609 12.002 17.0605 12.373 16.5137 12.373L12.373 12.373L12.373 16.5234C12.373 17.0703 11.9824 17.4609 11.4258 17.4609C10.8887 17.4609 10.5078 17.0605 10.5078 16.5234L10.5078 12.373L6.37695 12.373C5.83008 12.373 5.42969 12.002 5.42969 11.4648Z' className='fill-gold-500'/>
        </g>
      </svg>
      <span className='text-gold-500'>Add Bell</span>
    </span>
  </div>
</div>)
export default AddBellButton
