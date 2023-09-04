import { useEffect, useRef } from "react"
import classNames from "utils/classNames"

const Loading = ({ show, items }: { show: boolean, items: string[] }) => {
  const list = useRef<HTMLUListElement>(null)
  useEffect(() => {
    list.current?.scrollTo(0, list.current.scrollHeight)
  }, [items])
  return <div className={classNames(
    'w-full h-full absolute top-0 left-0 z-10 grid place-content-center transition duration-1000 backdrop-blur-3xl',
    show ? '' : 'opacity-0 pointer-events-none'
  )}>
    <h1 className="text-3xl">Loading Assembly...</h1>
    <ul className="h-32 overflow-hidden" ref={list}>
      {
        items.map((item, index) => <li key={index}>
          {item}
        </li>)
      }
    </ul>
  </div>
}
export default Loading
