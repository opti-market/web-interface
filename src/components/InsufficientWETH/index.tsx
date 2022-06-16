import React from 'react'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { useIsDarkMode } from '../../state/user/hooks'
import RefreshIconGold from '../../assets/images/refresh_icon_gold.png'
import RefreshIconBlack from '../../assets/images/refresh_icon_black.png'


const InsuffientWETH = (props) => {
  const darkMode = useIsDarkMode()

  const wethBalance = parseFloat(ethers.utils.formatEther(props.wethBalance).substring(0, 12)).toFixed(4)
  const roundedBalance = Math.floor(Number(wethBalance) * 10000) / 10000

  const wethFloat = parseFloat(ethers.utils.formatEther(props.wethAmount).substring(0, 12)).toFixed(4)
  const missingWETH = Number(wethFloat) - roundedBalance

  return (
    <>
      <WETHbalanceDiv>
        <Balance>BALANCE:</Balance>
        {props.wethBalance.eq(0) || props.wethBalance.lt(props.wethAmount) ?
          <RedText> {` ${ roundedBalance } WETH `} </RedText>
          :
          <GreenText> {` ${ roundedBalance } WETH `} </GreenText>
        }
        <RefreshButton onClick={props.getWETHBalance}>
          <img
            src={darkMode ? RefreshIconGold : RefreshIconBlack}
            alt='refresh-button'
            width='auto'
            height={'20px'}

          />
        </RefreshButton>
      </WETHbalanceDiv>

      <Notice>
        {`You will need to swap ${ missingWETH } ETH for WETH on
        Uniswap or ZipSwap to BUY/BID  ⬇️ `}
      </Notice>
      <RowCenter>
        <GlowCardAnchor href={props.UNISWAP_URL} target='_blank'>
          ↪️ Uniswap
        </GlowCardAnchor>
        <GlowCardAnchor href={props.ZIPSWAP_URL} target='_blank'>
          ↪️ ZipSwap
        </GlowCardAnchor>
      </RowCenter>
      {props.wethBalance.eq(0) ?
        <></>
        :
        <GlowCardAnchor style={props.goBackButtonStyle} onClick={props.onClick}>
          👈  Go back
        </GlowCardAnchor>

      }
    </>
  )
}


const RedText = styled.div`
  color: red;
  padding: 6px 8px 0px 2px;
`

const GreenText = styled.div`
  color: green;
  padding: 6px 8px 0px 2px;
`
const Balance = styled.div`
  padding: 6px 6px 0px 0px;
`

const WETHbalanceDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;

  margin: 15px 0px 10px 0px;

  font-weight: 500;
  font-size: 17px;

  color: ${ ({ theme }) => theme.text2 };

  max-width: 280px;
`

const RefreshButton = styled.a`
  color: ${ ({ theme }) => theme.text2 };
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: 500;

  text-decoration: none;

  /* padding: 5px 5px 0px 5px;
   */
  height: 28px;
  width: 28px;

  border-radius: 0.6rem;
  box-shadow: 0.4px 0.4px 4px ${ ({ theme }) => theme.text2 };

  :hover {
    filter: drop-shadow(0 0 0.001px ${ ({ theme }) => theme.primary2 });
  }

  :active {
    transform: scale(0.97);
  }
`

const RowCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;
`

const GlowCardAnchor = styled.a`
  color: ${ ({ theme }) => theme.text2 };
  
  font-weight: 600;
  font-size: 16px;

  text-decoration: none;

  width: 123px;

  padding: 14px 16px;
  margin: 22px 10px 10px 10px;

  border-radius: 3rem;
  box-shadow: 0.51px 0.51px 4px ${ ({ theme }) => theme.text2 };

  :hover {
    filter: drop-shadow(0 0 0.001px ${ ({ theme }) => theme.primary2 });
  }

  :active {
    transform: scale(0.97);
  }
`

const Notice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;

  margin: 15px 0px 10px 0px;

  font-weight: 500;
  font-size: 17px;

  color: ${ ({ theme }) => theme.text2 };

  max-width: 250px;
`



export default InsuffientWETH