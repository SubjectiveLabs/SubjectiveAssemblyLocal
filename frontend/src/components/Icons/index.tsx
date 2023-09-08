export const Exclamation = () => <svg viewBox='0 0 16 16' width={16} height={16}>
  <circle cx={8} cy={8} r={8} className='fill-white' />
  <circle cx={8} cy={12} r={2} className='fill-rose-400' />
  <path d='
    M 8 2
    q 2 0 2 2
    v 3
    q 0 2 -2 2
    t -2 -2
    v -3
    q 0 -2 2 -2
    z' className='fill-rose-400' />
</svg>

export const ThreeDots = () => <svg viewBox='0 0 16 16' width={16} height={16}>
  <circle cx={8} cy={8} r={8} className='fill-white' />
  {[...Array(3)].map((_value, index, array) => <circle
    key={index}
    className='fill-blue-500'
    cx={(4 * Math.cos((2 * Math.PI / array.length * index) - (Math.PI / 2))) + 8}
    cy={(4 * Math.sin((2 * Math.PI / array.length * index) - (Math.PI / 2))) + 8}
    r={2.5}
  />)}
</svg>

export const Plus = () => <svg viewBox='0 0 16 16' width={16} height={16}>
  <circle cx={8} cy={8} r={8} className='fill-white' />
  <path d='
    M 8 2.5
    q 1.25 0 1.25 1.25
    v 3
    h 3
    q 1.25 0 1.25 1.25
    t -1.25 1.25
    h -3
    v 3
    q 0 1.25 -1.25 1.25
    t -1.25 -1.25
    v -3
    h -3
    q -1.25 0 -1.25 -1.25
    t 1.25 -1.25
    h 3
    v -3
    q 0 -1.25 1.25 -1.25
    z'/>
</svg>
