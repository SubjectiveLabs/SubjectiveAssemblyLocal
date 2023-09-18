export const Exclamation = () => <svg viewBox='0 0 16 16' width={16} height={16}>
  <circle cx={8} cy={8} r={8} className='fill-white' />
  <circle cx={8} cy={12} r={2} className='fill-red-500' />
  <path d='
    M 8 2
    q 2 0 2 2
    v 3
    q 0 2 -2 2
    t -2 -2
    v -3
    q 0 -2 2 -2
    z' className='fill-red-500' />
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

export const Key = `
  M 1 15
  l 5 0
  l 0 -1.5
  l 1.5 0
  l 0 -1.5
  l 1.5 0
  l 0 -1.5
  a 4.5 4.5 0 1 0 -3 -3
  l -5 5
  M 12.5 5
  a 1 1 0 0 1 -1 1
  a 1 1 0 0 1 -1 -1
  a 1 1 0 0 1 1 -1
  a 1 1 0 0 1 1 1
  z
`

export const Door = `
  M 1 1
  l 9 0
  l 0 14
  l -9 0
  z
  m 5.5 6
  l 6 0
  l -1.5 -1.5
  l 1 -1
  l 3.5 3.5
  l -3.5 3.5
  l -1 -1
  l 1.5 -1.5
  l -8 0
`

export const Pencil = `
  M 1 15
  l 3 -1
  l 8 -8
  l -2 -2
  l -8 8
  z
  m 9.5 -11.5
  l 2 2
  l 1 -1
  a 1 1 0 0 0 0 -1
  l -1 -1
  a 1 1 0 0 0 -1 0
  z
`

export const Heart = `
  M 8 13.333
  a 0.666 0.666 0 0 1 -0.291 -0.066
  C 7.476 13.153 2 10.447 2 6
  a 3.333 3.333 0 0 1 5.69 -2.357
  l 0.31 0.31 0.31 -0.31
  A 3.333 3.333 0 0 1 14 6
  c 0 4.431 -5.475 7.152 -5.708 7.27
  A 0.666 0.666 0 0 1 8 13.333
  z
`

export const Bin = `
  M 5 1
  l 6 0
  l 1 2
  l 2 0
  l 0 1
  l -12 0
  l 0 -1
  l 2 0
  z
  M 3.5 5
  l 9 0
  l -0.5 9
  l -8 0
  z
`

export const Check = `
  M 1.5 9
  l 4 5
  l 9 -12
`

export const Slash = `
  M 12 1.5
  l -8 13
`

export const Cross = `
  M 2 2
  l 12 12
  m 0 -12
  l -12 12
`
