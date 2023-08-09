import Footer from 'Footer'
import config from 'config.json'

type Notice = {
  content: string,
  priority: boolean,
  time: string,
  title: string,
}

const App = () => {
  const notices: Notice[] = [
    {
      content : 'D13 & D14 classes will be running in B2 as carpets are replaced.',
      priority: true,
      time    : 'Today',
      title   : 'D Block Room Changes'
    },
    {
      content : 'French will be off today due to a Year 11 excursion occuring. See you next week!',
      priority: false,
      time    : 'Until 12th September',
      title   : 'French Club'
    },
    {
      content : 'Meeting tomorrow lunch in TLC for Year 9 will be running outlining the subject selection process for 2024.',
      priority: false,
      time    : 'Until tomorrow',
      title   : 'Y9 2024 Subject Selection'
    }
  ]
  return <>
    <div className='p-4 bg-gray-50 h-full flex flex-col gap-4 font-semibold tracking-tighter leading-none'>
      <header className='text-center flex flex-col shrink grow-0 basis-auto'>
        <h1>Welcome to</h1>
        <h1 className='flex items-center text-xl gap-2 justify-center font-bold'>
          <img src={config.schoolIconPath} alt={config.schoolName} className='h-6 ' />
          {config.schoolName}
        </h1>
      </header>
      <div className='border shadow-lg rounded-2xl grow shrink-0 basis-auto p-4 flex flex-col gap-2'>
        <div className='gap-2 items-center flex text-xl'>
          <span className='bg-black w-6 h-6 inline-flex rounded-full rounded-bl-none'></span>
          Messaging
        </div>
        <div className='flex gap-1'>
          <span className='text-gray-500'>Noticeboard</span>
          <span>{notices.length} notices</span>
        </div>
        <ul className='flex flex-col gap-4'>
          {
            notices.map((notice, index) => <div className='border shadow-lg rounded-2xl p-4' key={index}>
              <h2 className='font-bold flex gap-1 items-center'>
                {
                  notice.priority && <span className='text-red-400 flex items-center gap-1'>
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
            </div>)
          }
        </ul>
      </div>
      <Footer active={0}/>
    </div>
  </>
}

export default App
