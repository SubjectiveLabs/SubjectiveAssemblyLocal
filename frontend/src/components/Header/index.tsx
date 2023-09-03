type Config = {
  schoolIconPath: string,
  schoolName: string,
  password: string,
}

const Header = ({config}: {config: Config}) => <header className='text-center flex flex-col shrink grow-0 basis-auto'>
  <h1>Welcome to</h1>
  <h1 className='flex items-center text-xl gap-2 justify-center font-bold'>
    <img src={config.schoolIconPath} alt={config.schoolName} className='h-6' />
    {config.schoolName}
  </h1>
</header>

export default Header
