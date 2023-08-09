import config from 'config.json'

const App = () => <>
  <div className='p-8 bg-gray-50 h-full'>
    <header className='text-center text-2xl flex flex-col'>
      <h1>Welcome to</h1>
      <h1 className='flex items-center text-3xl gap-2 justify-center'>
        <img src={config.schoolIconPath} alt={config.schoolName} className='w-16 h-16' />
        {config.schoolName}
      </h1>
    </header>
  </div>
</>

export default App
