import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react'

const useStateRef = <S, >(initialValue: S): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] => {
  const [ value, setValue ] = useState(initialValue),
        ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])

  return [ value, setValue, ref ]
}

export default useStateRef
