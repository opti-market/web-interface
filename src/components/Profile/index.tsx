/* External imports */
import React, { useLayoutEffect, useState } from 'react'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { ExternalLink as LinkIcon } from 'react-feather'
import { BigNumber } from '@ethersproject/bignumber'

/* Internal imports */
import MarketBox from '../MarketBox'
import InfoTooltip from '../InfoTooltip'
import Spinner from '../Suspense/Spinner'
import Copy from '../AccountDetails/Copy'
import NetworkWarning from '../NetworkWarning'
import { shortenAddress } from '../../utils'
import { OPTIMISTIC_ETHERSCAN_URL, initZero } from '../../utils/utils'
import { checkEscrowAmount } from '../../lib/contract-apis/marketplace'


const Profile = ({
  account,
  chainId,
  library,
  selector,
  setSelector,
  userCollections,
  noTokensPresent,
  fetchUserAssets,
  isNotOnOptimism
}: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [escrowWETHAmount, setEscrowWETHAmount] = useState<BigNumber>(initZero)

  async function getEscrowedWETH() {
    if (account == null || account === undefined) return initZero

    let account_: string = account

    const checkEscrowAmount_: any = await checkEscrowAmount(account_, chainId)

    setEscrowWETHAmount(checkEscrowAmount_)

    return checkEscrowAmount_
  }

  const usersEscrowedWETH: number = Number(
    parseFloat(ethers.utils.formatEther(escrowWETHAmount)).toFixed(3)
  )

  useLayoutEffect(() => {
    setIsLoading(true)

    setSelector('Profile')

    if (account && (chainId === 10 || chainId === 69)) {
      fetchUserAssets()
      getEscrowedWETH()
    }

    setIsLoading(false)
  }, [account, chainId, library, isLoading])


  return (
    <>
      {isNotOnOptimism ? (
        <>
          <NetworkWarning />
        </>
      ) : (
        <>
          {isLoading ? (
            <>
              <Spinner />
            </>
          ) : (
            <>
              {noTokensPresent === true ? (
                <h2>
                  You have no NFTs!
                </h2>
              ) : (
                <>
                  <HeaderWrap>
                    <Header>My Assets</Header>
                    <SubHeader>
                      {account && shortenAddress(account)}
                      {account && (
                        <Copy toCopy={account}>
                          <span style={{ marginLeft: '5px' }}>Copy</span>
                        </Copy>
                      )}
                      {account && (
                        <AddressAnchor
                          href={`${ OPTIMISTIC_ETHERSCAN_URL }${ account }`}
                          target={'_blank'}
                        >
                          <LinkIcon size={16} />
                          <span style={{ marginLeft: '4px' }}>
                            View on Etherscan
                          </span>
                        </AddressAnchor>
                      )}
                    </SubHeader>
                    {(usersEscrowedWETH > 0) ? (
                      <MetricBox>
                        <EscrowedWETH>
                          {`Escrowed WETH: ${ usersEscrowedWETH }`}
                          <InfoTooltip
                            content1={'Total escrowed WETH for active offers you have placed.'}
                            label={'Users Escrowed WETH'}
                            questionMarkHeight={'15px'}
                          />
                        </EscrowedWETH>
                      </MetricBox>
                    ) : (
                      <></>
                    )}
                  </HeaderWrap>
                  <MarketBox
                    selector={selector}
                    loadCollection={[]}
                    homeCollections={[]}
                    isLoading={isLoading}
                    userCollections={userCollections}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}


const EscrowedWETH = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0px 4px 0px 4px;

  color: ${ ({ theme }) => theme.primary2 };
  font-size: 18px;
`

const HeaderWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`

const Header = styled.h1`
  display: flex;
  justify-content: center;
  align-self: center;
  text-align: center;

  margin: 30px 0px 0px 0px;
`

const SubHeader = styled.h3`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  white-space: nowrap;

  color: ${ ({ theme }) => theme.primary2 };
  font-size: 18px;
`

const AddressAnchor = styled.a`
  display: flex;
  margin-left: 1rem;
  
  font-size: 0.825rem;
  font-weight: 500;

  color: ${ ({ theme }) => theme.text1 };
  text-decoration: none;

  cursor: pointer;

  :hover {
    color: ${ ({ theme }) => theme.primary2 };
  }
`

const MetricBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  
  padding: 8px;
  margin-left: auto;
  margin-right: auto;
  max-width: 300px;

  font-size: 20px;
  font-weight: 600;

  border: 1px solid ${ ({ theme }) => theme.text2 };
  border-radius: 8px;

  :hover {
    cursor: pointer;
    opacity: 0.7;
    transform: scale(1.006);
  }

  :active {
    transform: scale(0.99)
  }

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    margin: 10px;
  `};
`


export default Profile
