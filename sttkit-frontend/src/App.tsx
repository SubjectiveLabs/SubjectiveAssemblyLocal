import Divider from 'Divider'
import Header from 'Header'

const App = () => {
  const dayEndings = [
    "content-['onday']",
    "content-['esday']",
    "content-['ednesday']",
    "content-['ursday']",
    "content-['riday']",
    "content-['turday']",
    "content-['nday']"
  ],
        daysShort = [
          'M',
          'Tu',
          'W',
          'Th',
          'F',
          'Sa',
          'Su'
        ]
  return <>
    <div className='h-full bg-cinder-950 flex flex-col p-4 gap-6 font-extrabold tracking-tighter'>
      <Header />
      <Divider />
      <div className='flex items-center my-6'>
        <span className='text-gold-200 rotate-90 absolute text-2xl leading-none -translate-x-5'>
          DAYS
        </span>
        <div className='text-gold-100 flex justify-between grow ps-12'>
          {daysShort.map(day => <span
            key={day}
            className='border-[3px] rounded-full w-10 h-10 grid place-content-center border-gold-200 hover:bg-gold-200 hover:text-indigo-600 transition duration-300 hover:scale-[1.25]'
            onClick={() => {
              document.querySelectorAll('*').forEach(element => {
                element.className += ' rotate-[1000deg] transition duration-[10s]'
              })
            }}
          >{day}</span>)}
        </div>
      </div>
      <Divider />
    </div>
  </>
}

export default App
