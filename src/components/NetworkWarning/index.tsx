/* External imports */
import React from 'react'
import styled from 'styled-components'

/* Internal imports */
import { EXTERNAL_LINKS } from '../../constants/links'


export default function NetworkWarning(props): any {

  let defaultMessage = true
  if (props.messageType === 'short') defaultMessage = false

  
  return (
    <>
      { defaultMessage ? (
        <WarningBox>
          OptiMarket is native to Optimism.
          <br /><br />
          Please connect to the <External href={EXTERNAL_LINKS.FAQ.OpChainid}>Optimism network</External>!
        </WarningBox>
      ) : (
        <WarningBoxShort>
            Connect to the <External href={EXTERNAL_LINKS.FAQ.OpChainid}>Optimism network</External> in order to Buy/Bid.
        </WarningBoxShort>
      )}

    </>
  )
}


const WarningBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  
  padding: 30px;
  margin: 30px 30px 50px 30px;

  text-align: center;
  font-size: 25px;
  font-weight: 600;

  border: 1px solid ${ ({ theme }) => theme.text2 };
  border-radius: 8px;

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    margin: 50px 30px 50px 30px;
  `};
`

const WarningBoxShort = styled.div`
  display: flex;
  flex-direction: row;
  /* justify-content: space-around; */
  
  padding: 12px;
  margin: 20px 8px 20px 8px;

  text-align: center;
  font-size: 22px;
  font-weight: 500;

  border: 1px solid ${ ({ theme }) => theme.text2 };
  border-radius: 8px;

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    margin: 50px 30px 50px 30px;
  `};
`

const External = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  display: contents;
  color: ${ ({ theme }) => theme.primary2 };

  :hover {
    color: ${ ({ theme }) => theme.text2 };
    text-decoration: none;
  }
`
