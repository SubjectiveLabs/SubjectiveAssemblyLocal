import classNames from 'classNames'

const Footer = ({ active }: {active:number}) => <footer className='flex justify-center shrink grow-0 basis-auto items-center gap-1 pb-4'>
  {
    [...Array(2)].map((_value, index) => <span
      className={classNames(
        'w-3 h-3 inline-flex rounded-full',
        active === index
          ? 'bg-gray-500'
          : 'bg-gray-400'
      )}
      key={index}
    ></span>)
  }
</footer>

export default Footer
