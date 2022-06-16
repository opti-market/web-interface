import React from 'react'
import styled from 'styled-components'

const ErrorMsg = ({ ctcCallReverted, revertMsg }: any) => {
  return (
    <>
      {ctcCallReverted ? (
        <StyledErrorMsg>⛔️ Error! {revertMsg}</StyledErrorMsg>
      ) : (
        <>
        </>
      )}
    </>
  )
}

const TransferErrorMsg = ({ transferCallReverted, transferRevertMsg }: any) => {
  return (
    <>
      {transferCallReverted ? (
        <StyledErrorMsg>⛔️ Error! {transferRevertMsg}</StyledErrorMsg>
      ) : (
        <>
        </>
      )}
    </>
  )
}


const StyledErrorMsg = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;

  text-align: center;

  
  font-weight: 600;
  font-size: 13px;
  color: #FF2B00;
  
  margin: 10px 0px 0px 0px;
  max-width: 230px;
`


export { ErrorMsg, TransferErrorMsg }