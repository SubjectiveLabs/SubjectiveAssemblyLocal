import { useContext, useState } from 'react'
import classNames from 'classNames'
import { AppContext } from 'App'
import { Link } from 'backend'

const Link = ({ link }: { link: Link }) => {
  const [deleting, setDeleting] = useState(false),
    [, setSchool] = useContext(AppContext)
  return <div className='border rounded-2xl p-4 flex gap-4 items-center'>
    <button
      className={classNames(
        'inline-flex outline-red-300 outline-2 outline -outline-offset-2 bg-red-200 p-2 rounded-xl aspect-square',
        deleting
          ? 'animate-spin'
          : ''
      )}
      onClick={() => {
        if (!deleting) {
          setSchool(previous => {
            const next = { ...previous }
            next.links = next.links.filter(l => l.id !== link.id)
            return next
          })
        }
        setDeleting(true)
      }}
    >
      &#128465;
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
