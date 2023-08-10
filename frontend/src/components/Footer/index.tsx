import classNames from 'classNames'

const Footer = ({ active, select }: {active:number, select: (index: number) => void}) => <footer className='flex justify-center shrink grow-0 basis-auto items-center gap-2 p-4'>
  {
    [...Array(2)].map((_value, index) => <span
      className={classNames(
        'w-3 h-3 inline-flex rounded-full transition duration-300',
        active === index
          ? 'bg-gray-500'
          : 'bg-gray-400'
      )}
      key={index}
      onClick={() => select(index)}
    ></span>)
  }
</footer>

export default Footer
