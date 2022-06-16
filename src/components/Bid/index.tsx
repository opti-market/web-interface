/* External imports */
import React, { useState, useEffect, useLayoutEffect } from 'react'
import styled from 'styled-components'
import { ethers, BigNumber } from 'ethers'

/* Internal imports */
import TxForm from '../TxForm'
import FeesInfo from '../FeesInfo'
import TxTernary from '../TxTernary'
import ButtonTernary from '../ButtonTernary'
import InsuffientWETH from '../InsufficientWETH'
import { initZero } from '../../utils/utils'
import { EXTERNAL_LINKS } from '../../constants/links'
import { approveWETH9, allowance } from '../../lib/contract-apis/weth9'
import { escrowedBid, changeBid } from '../../lib/contract-apis/marketplace'


/**
 * @todo `Bid` component looks to have too many arguments. Make sure that there
 *       is nothing in this component that can be decoupled.
 */
const Bid = ({
  account,
  chainId,
  library,
  openBid,
  tokenId,
  revertMsg,
  collection,
  wethBalance,
  allowance_,
  setRevertMsg,
  setAllowance,
  getWETHBalance,
  ctcCallReverted,
  userHasActiveBid,
  approvedAllowance,
  setBidTxConfirmed,
  setCtcCallReverted,
  setApprovedAllowance
}: any) => {
  const [wad, setWad] = useState<BigNumber>(initZero)
  const [wethAmount, setWETHAmount] = useState<BigNumber>(initZero)
  const [fetchingAllowance, setFetchingAllowance] = useState<boolean>(false)
  /**
   * @todo Passing 2 props to the `disabled` prop to `ButtonTernary` does not 
   *       work.
   */
  // const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false)
  const [expirationOption, setExpirationOption] = useState<any>(2)
  // Suspense states
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false)
  const [
    pendingApprovalTxConfirmation,
    setPendingApprovalTxConfirmation
  ] = useState<boolean>(false)
  const [
    pendingEscrowedBidTxConfirmation,
    setPendingEscrowedBidTxConfirmation
  ] = useState<boolean>(false)

  const goBackButtonStyle = {
    justifyContent: 'center',
    alignSelf: 'center',
    cursor: 'pointer'
  }
  const checkboxStyle = { marginTop: '10px', height: '20px', width: '20px' }

  let collectionAddress = '',
    UNISWAP_URL = '',
    ZIPSWAP_URL = ''

  if (chainId === 69) {
    collectionAddress = collection.contractAddress__Kovan
    UNISWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-kovan'].Uniswap
    ZIPSWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-kovan'].ZipSwap
  }

  if (chainId === 10) {
    collectionAddress = collection.contractAddress__Mainnet
    UNISWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-mainnet'].Uniswap
    ZIPSWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-mainnet'].ZipSwap
  }

  // Revert messages
  const executionRevertedTxMsg = 'execution reverted'
  const deniedTxMsg = 'MetaMask Tx Signature: User denied transaction signature.'
  // Expiries
  const expirationOptionsArray = [
    { index: 0, time: "1 day" },
    { index: 1, time: "3 days" },
    { index: 2, time: "7 days" },
    { index: 3, time: "14 days" },
    { index: 4, time: "1 month" },
    { index: 5, time: "3 months" },
    { index: 6, time: "6 months" },
  ]



  const revertMsg_ = 'Only enter numbers and decimals!'

  const roundWETH = (wethAmount_) => {
    let roundedWETH_: number,
      roundedWETHstring_: string

    // We must round entries to 3 decimal places in order to round
    // make sure displayed values (3 decimal places) are accurate
    roundedWETH_ = Number(parseFloat(wethAmount_).toFixed(3))
    roundedWETHstring_ = roundedWETH_.toString()

    return roundedWETHstring_
  }

  const handleSetWETHAmount = (e: any) => {
    let wethAmount_,
      wethAmountInEther,
      isNum,
      isFloat,
      isUglyFloat1,
      isUglyFloat2

    wethAmount_ = e.currentTarget.value
    isNum = /^\d+$/.test(wethAmount_)
    isFloat = /^[0-9]+\.[0-9]+$/.test(wethAmount_)
    isUglyFloat1 = /^\.[0-9]+$/.test(wethAmount_)
    isUglyFloat2 = /^[0-9]+\.$/.test(wethAmount_)

    if (isNum || isFloat || isUglyFloat1 || isUglyFloat2) {
      setCtcCallReverted(false)

      if (wethAmount_.indexOf(' ') >= 0) { // if includes whitespace
        wethAmount_.trim()
        wethAmountInEther = ethers.utils.parseEther(roundWETH(wethAmount_))
      } else if (!isNaN(wethAmount_) && wethAmount_ !== '') {
        wethAmountInEther = ethers.utils.parseEther(roundWETH(wethAmount_))
      } else {
        if (
          (wethBalance.lte(wethAmount) && approvedAllowance.eq(0)) ||
          (wethBalance.lte(wethAmount) && approvedAllowance.gt(0))
        ) {
          // We want to show this revert message at the same time that we show 
          // the bid form
          // setIsDisabled(true)
          setCtcCallReverted(true)
          setRevertMsg('Offer price must be > 0!')
        } else {
          // setIsDisabled(true)
          setCtcCallReverted(true)
          setRevertMsg('WETH amount must be > 0!')
        }
      }

      // setIsDisabled(false)
      setWad(wethAmountInEther)
      setWETHAmount(wethAmountInEther)
    } else {
      // setIsDisabled(true)
      setCtcCallReverted(true)
      setRevertMsg(revertMsg_)
    }
  }

  const handleBid = async (e: any) => {
    e.preventDefault()

    let escrowedBid_: any,
      changeBid_: any,
      bidPrice_ = wethAmount

    setBidTxConfirmed(false) // enforce `false` state before ctc call
    setPendingUserAction(true)

    if (!userHasActiveBid) escrowedBid_ = await escrowedBid(
      collectionAddress,
      tokenId,
      bidPrice_,
      expirationOption,
      account,
      chainId,
      library
    )

    if (userHasActiveBid) changeBid_ = await changeBid(
      collectionAddress,
      tokenId,
      bidPrice_,
      expirationOption,
      account,
      chainId,
      library
    )

    setPendingUserAction(false)

    /**
     * @todo Do the same checks for different wallets
     */
    let currentBid: any = escrowedBid_

    if (userHasActiveBid) currentBid = changeBid_

    if (currentBid === deniedTxMsg) {
      setPendingEscrowedBidTxConfirmation(false) // stop loading spinner
      setCtcCallReverted(true)
      setRevertMsg(currentBid)
    }

    if (typeof currentBid === 'string') {
      if (currentBid.slice(0, 18) === executionRevertedTxMsg) {
        setPendingEscrowedBidTxConfirmation(false)
        setCtcCallReverted(true)
        setRevertMsg(currentBid)

      }
    } else {
      setPendingEscrowedBidTxConfirmation(true)

      currentBid = await currentBid.wait()

      if (currentBid.status === 1) {
        setPendingEscrowedBidTxConfirmation(false)
        setBidTxConfirmed(true)
      }
    }
  }

  const handleApproveWETH = async (e: any) => {
    e.preventDefault()

    let approveWETH9_: any,
      formattedWad = wad

    setPendingUserAction(true)

    approveWETH9_ = await approveWETH9(
      // Adds one WEI to the approved allowance
      formattedWad.add(1),
      account,
      chainId,
      library
    )

    setPendingUserAction(false)

    /**
     * @todo Do the same checks for different wallets
     */
    if (approveWETH9_ === deniedTxMsg) {
      setPendingApprovalTxConfirmation(false)
      setCtcCallReverted(true)
      setRevertMsg(approveWETH9_)
    }

    if (typeof approveWETH9_ === 'string') {
      if (approveWETH9_.slice(0, 18) === executionRevertedTxMsg) {
        setPendingApprovalTxConfirmation(false)
        setCtcCallReverted(true)
        setRevertMsg(approveWETH9_)
      }
    } else {
      setPendingApprovalTxConfirmation(true)

      approveWETH9_ = await approveWETH9_.wait()

      if (approveWETH9_.status === 1) {
        setPendingApprovalTxConfirmation(false)

        allowance(account, chainId, library).then((_allowance: any) => {
          setApprovedAllowance(_allowance)
        })
      }
    }
  }

  // Used to approve WETH then place bid, 
  const handleApproveThenBid = async (e: any) => {
    e.preventDefault()

    if (allowance_.lte(wethAmount) && wethAmount.gt(0)) {
      await handleApproveWETH(e)
      await handleBid(e)
    } else {
      await handleBid(e)
    }
  }

  const handleCheckbox = (e: any) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    setReadyToSubmit(value)
  }

  const handleGoBack = () => {
    getWETHBalance()
    setWETHAmount(initZero)
  }

  function getAllowance() {
    allowance(account, chainId, library).then((_allowance: any) => {
      // Only set the allowance if it is > 0 and it changed
      if (_allowance.gt(0) && !_allowance.eq(allowance_))
        setAllowance(_allowance)
      if (fetchingAllowance) setFetchingAllowance(false)
    })
  }

  useLayoutEffect(() => {
    if (account && openBid && wethAmount.gt(0) && allowance_.eq(0)
      && !fetchingAllowance) {
      // The allowance should already be fetched from assetDetails
      // Only fetch again if it is zero. Otherwise approveWETH first.
      setFetchingAllowance(true)
      getAllowance()
    }
  }, [wethAmount, account, chainId, library])

  useEffect(() => {
    if (account && openBid)
      setAllowance(approvedAllowance)
  }, [account, approvedAllowance])

  return (
    <>
      <ButtonCentering>
        {wethAmount.gt(0) && (
          (wethBalance.lte(wethAmount) &&
            approvedAllowance.eq(0)) ||
          (wethBalance.lte(wethAmount) &&
            approvedAllowance.gt(0))) ? (
          <>
            <InsuffientWETH
              onClick={handleGoBack}
              wethAmount={wethAmount}
              wethBalance={wethBalance}
              getWETHBalance={getWETHBalance}
              UNISWAP_URL={UNISWAP_URL}
              ZIPSWAP_URL={ZIPSWAP_URL}
              goBackButtonStyle={goBackButtonStyle}
            />
          </>
        ) : (
          <>
            <TxTernary
              conditional={pendingUserAction}
              suspenseMsg='Waiting for you to confirm tx...'
            >
              <TxTernary
                conditional={pendingApprovalTxConfirmation || pendingEscrowedBidTxConfirmation}
                suspenseMsg='Waiting for your tx status to be confirmed on Optimism...'
              >
                <TimerWrap>
                  <TimerDesc>Duration:</TimerDesc>
                  <TimerSelect
                    id="expiryOptions"
                    value={expirationOption}
                    placeholder='Duration'
                    onChange={(e: any) => {
                      setExpirationOption(e.target.value)
                    }}
                  >
                    {expirationOptionsArray.map(option => {
                      return (
                        <option
                          key={option.index}
                          value={option.index}>{option.time}
                        </option>
                      )
                    })}
                  </TimerSelect>
                </TimerWrap>
                <TxForm
                  onSubmit={handleApproveThenBid}
                  placeholder='0.420 (ETH)'
                  formName='bid price to set bid'
                  onChange={handleSetWETHAmount}
                  ctcCallReverted={ctcCallReverted}
                  revertMsg={revertMsg}
                  inputMode={'decimal'}
                >
                  <Notice>
                    <div style={{ marginBottom: '10px' }}>
                      <em>May</em> require you to confirm 2 txs:
                    </div>
                    1. Approve WETH allowance <br /><em>(if needed)</em>
                    <br />
                    2. Update/confirm your offer price
                    <br />I understood
                    <input
                      style={checkboxStyle}
                      type='checkbox'
                      checked={readyToSubmit}
                      onChange={handleCheckbox}
                    />
                  </Notice>
                  <ButtonTernary
                    type='submit'
                    disabled={!readyToSubmit}
                    conditional={userHasActiveBid}
                    defaultButtonName={'Update offer'}
                    secondaryButtonName={'Confirm offer'}
                  />
                </TxForm>
                <FeesInfo collection={collection} chainId={chainId} />
              </TxTernary>
            </TxTernary>
          </>
        )}
      </ButtonCentering>
    </>
  )
}


const Notice = styled.div`
  margin: 15px 0px 0px 0px;

  text-align: center;
  font-weight: 500;
  font-size: 17px;

  color: ${ ({ theme }) => theme.text2 };

  max-width: 250px;
`

const ButtonCentering = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
`

const TimerWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  
  margin: 15px 0px 15px 0px;
`

const TimerDesc = styled.div`
  text-size: 18px;
  font-weight: 700;
  margin-right: 15px;
`

const TimerSelect = styled.select`
  align-self: center;

  padding: 5px;
  max-width: 150px;

  border-style: solid;
  border-width: 1px;
  border-color: none;
  border-radius: 4rem;

  color: ${ ({ theme }) => theme.text2 };
  background-color: ${ ({ theme }) => theme.bg1 };

  text-overflow: ellipsis;
  text-align: center;

  font-size: 18px;

  filter: drop-shadow(0 0.01rem 0.12rem ${ ({ theme }) => theme.text2 });

  :focus {
    outline: none;
    filter: drop-shadow(0 0.01rem 0.2rem ${ ({ theme }) => theme.text2 });
  }
`


export default Bid
