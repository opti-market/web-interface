/* External imports */
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Jazzicon from '@metamask/jazzicon'

/* Internal imports */
import { useActiveWeb3React } from '../../hooks'


const Identicon = () => {
  const { account } = useActiveWeb3React()
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
    }
  }, [account])


  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return (
    <IdenticonContainer ref={ref as any} />
  )
}


const IdenticonContainer = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
`


export default Identicon