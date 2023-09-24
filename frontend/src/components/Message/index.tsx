import { Notice } from "backend"

const Message = ({ notice }: { notice: Notice }) => <div className='border rounded-2xl p-4 flex flex-col'>
  <h2 className='font-bold flex gap-1 items-center'>
    {
      notice.priority && <span className='text-red-500 flex items-center gap-1'>
        <span className='font-extrabold text-xl'>!</span>
        Priority
      </span>
    }
    {notice.title}
  </h2>
  <p className='text-gray-600'>{notice.content}</p>
</div>

export default Message
