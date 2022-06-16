/* External imports */
import React from 'react'
import styled from 'styled-components'

/* Internal imports */
import { useIsDarkMode } from '../../state/user/hooks'

const AppSuspense = styled.div`
  padding: 10px;
  margin: 10px;
  
  text-align: center;

  color: ${ (props) => props.className ? 'white' : 'black' };

  animation: fadeinout 0.7s linear 420 forwards;

  @keyframes fadeinout {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`

/**
 * @todo Improve this suspense component
 */
export default function CoreAppSuspense() {
  const darkMode = useIsDarkMode()

  return (
    <>
      <AppSuspense className={darkMode ? 'black' : ''}>Loading...</AppSuspense>
    </>
  )
}
