import Divider from 'Divider'

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
    <div className='h-full bg-cinder-950 flex flex-col p-6 gap-6 font-extrabold tracking-tighter'>
      <header className='text-center flex items-baseline gap-3 justify-center'>
        <h1 className='text-gold-500 tracking-[-5px] text-4xl leading-none'>SchoolScout</h1>
        <h2 className='text-gold-200 text-2xl leading-none'>Assembly</h2>
      </header>
      <Divider />
      <div className='flex items-center'>
        <span className='text-gold-200 rotate-90 inline-block text-2xl leading-none -translate-x-5 py-6'>
          DAYS
        </span>
        <div className='text-gold-100 flex justify-between grow'>
          {daysShort.map(day => <span key={day} className='border-[3px] rounded-full w-10 h-10 grid place-content-center border-gold-200'>{day}</span>)}
        </div>
      </div>
      <Divider />
    </div>
  </>
}

export default App
