import { AppContext } from "App"
import { Notice } from "backend"
import { Bin } from "components/Icons"
import { useContext } from "react"
import classNames from "utils/classNames"

const Message = ({ notice }: { notice: Notice }) => {
  const {
    school: [, setSchool],
  } = useContext(AppContext)
  return <div className='border rounded-2xl p-4 flex flex-col gap-4'>
    <h2 className='font-bold flex gap-4 items-center'>
      <button
        className={classNames(
          'inline-flex bg-red-500 p-2 rounded-xl aspect-square',
        )}
        onClick={() => {
          setSchool(previous => {
            const next = { ...previous }
            next.notices = next.notices.filter(({ id }) => id !== notice.id)
            return next
          })
        }}
      >
        <svg width={16} height={16} viewBox='0 0 16 16'>
          <path
            d={Bin}
            className='fill-white'
          />
        </svg>
      </button>
      <button
        className={classNames(
          'bg-red-500 text-white rounded-xl px-2 flex items-center gap-1 transition duration-500 h-full',
          notice.priority ? '' : 'opacity-50',
        )}
        onClick={() => {
          setSchool(previous => {
            const next = { ...previous }
            next.notices.find(({ id }) => id === notice.id)!.priority = !notice.priority
            return next
          })
        }}
      >
        <span className='font-extrabold text-xl'>!</span>
        Priority
      </button>
      <input
        type='text'
        defaultValue={notice.title}
        className='bg-gray-200 rounded-xl p-1 w-full transition peer duration-300 h-full px-2'
        required
        onBlur={event => {
          setSchool(previous => {
            const next = { ...previous }
            next.notices.find(({ id }) => id === notice.id)!.title = event.target.value
            return next
          })
        }}
      />
    </h2>
    <textarea
      defaultValue={notice.content}
      className='bg-gray-200 rounded-xl p-1 w-full transition peer duration-300 h-full px-2'
      required
      onBlur={event => {
        setSchool(previous => {
          const next = { ...previous }
          next.notices.find(({ id }) => id === notice.id)!.content = event.target.value
          return next
        })
      }}
    />
  </div>
}

export default Message
