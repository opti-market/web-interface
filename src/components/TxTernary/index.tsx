import React from 'react'


const TxTernary = (props: {
  conditional: boolean,
  suspenseMsg: string,
  children?: React.ReactNode
}) => {
  return props.conditional ?
    <div style={{ marginBottom: '10px' }}>{props.suspenseMsg}</div> : <>{props.children}</>
}

export default TxTernary