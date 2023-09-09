import { useContext } from 'react'
import { AppContext } from 'App'
import { Link } from 'backend'

const Link = ({ link }: { link: Link }) => {
  const { school: [, setSchool] } = useContext(AppContext)
  return <div className='border rounded-2xl p-4 flex gap-4 items-center'>
    <button
      className='inline-flex bg-red-500 p-2 rounded-xl aspect-square'
      onClick={() => {
        setSchool(previous => {
          const next = { ...previous }
          next.links = next.links.filter(l => l.id !== link.id)
          return next
        })
      }}
    >
      <svg width={16} height={16} viewBox='0 0 16 16'>
        <path
          d="
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
          "
          className='fill-white'
        />
      </svg>
    </button>
    <input
      type='text'
      defaultValue={link.title}
      className='bg-gray-200 rounded-xl p-1 w-full transition peer duration-300 h-full px-2'
      maxLength={127}
      required
      onBlur={event => {
        const name = event.target.value
        setSchool(previous => {
          const next = { ...previous }
          next.links.forEach(l => {
            if (l.id === link.id)
              l.title = name
          })
          return next
        })
      }}
    />
    <input
      type='text'
      defaultValue={link.destination}
      className='bg-gray-200 rounded-xl p-1 w-full transition peer duration-300 h-full px-2'
      maxLength={127}
      required
      onBlur={event => {
        const name = event.target.value
        setSchool(previous => {
          const next = { ...previous }
          next.links.forEach(l => {
            if (l.id === link.id)
              l.destination = name
          })
          return next
        })
      }}
    />
  </div>
}

export default Link
