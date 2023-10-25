export type Notice = {
  content: string,
  priority: boolean,
  time: string,
  title: string,
}

const Message = ({ notice }: { notice: Notice }) => <div className='border rounded-2xl p-4'>
  <h2 className='font-bold flex gap-1 items-center'>
    {
      notice.priority && <span className='text-red-500 flex items-center gap-1'>
        <span className='font-extrabold text-xl'>!</span>
                    Priority
      </span>
    }
    {notice.title}
  </h2>
  <p className='text-gray-600 text-xm'>{notice.content}</p>
  <span className='text-gray-400 text-sm flex gap-1 items-center'>
    <span className='bg-gray-400 w-3 h-3 inline-flex rounded-full'></span>
    {notice.time}
  </span>
</div>

export default Message
