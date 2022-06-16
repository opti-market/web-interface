/* External imports */
import React, { memo, useState, useEffect, useLayoutEffect } from 'react'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'

/* Internal imports */
import TxForm from '../TxForm'
import TxTernary from '../TxTernary'
import ButtonTernary from '../ButtonTernary'
import {
  isApprovedForAll,
  setApprovalForAll
} from '../../lib/contract-apis/erc721'
import { initZero } from '../../utils/utils'
import { listToken } from '../../lib/contract-apis/marketplace'
import FeesInfo from '../FeesInfo'
import InfoTooltip from '../InfoTooltip'


const ListToken = ({
  tokenId,
  account,
  chainId,
  library,
  revertMsg,
  collection,
  assetListed,
  setRevertMsg,
  ctcCallReverted,
  setCtcCallReverted,
  setListTokenTxConfirmed,
}: any) => {
  const [price, setPrice] = useState<BigNumber>(initZero)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false)
  const [hasApprovedForAll, setHasApprovedForAll] = useState<boolean>(false)
  const [
    hasSetApprovedForAll,
    setHasSetApprovedForAll
  ] = useState<boolean>(false)
  const [
    pendingApprovalTxConfirmation,
    setPendingApprovalTxConfirmation
  ] = useState<boolean>(false)
  const [
    pendingListTokenTxConfirmation,
    setPendingListTokenTxConfirmation
  ] = useState<boolean>(false)

  const deniedTxMsg = 'MetaMask Tx Signature: User denied transaction signature.'
  const executionRevertedTxMsg = 'execution reverted'

  let collectionAddress = ''

  if (chainId === 69) collectionAddress = collection.contractAddress__Kovan
  if (chainId === 10) collectionAddress = collection.contractAddress__Mainnet

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

    const revertMsg_ = 'Only enter numbers and decimals!'

    if (isNum || isFloat || isUglyFloat1 || isUglyFloat2) {
      setCtcCallReverted(false)

      if (wethAmount_.indexOf(' ') >= 0) { // if includes whitespace
        wethAmount_.trim()
        wethAmountInEther = ethers.utils.parseEther(roundWETH(wethAmount_))
      }

      if (!isNaN(wethAmount_) && wethAmount_ !== '') {
        wethAmountInEther = ethers.utils.parseEther(roundWETH(wethAmount_))
      }

      setIsDisabled(false)
      setPrice(wethAmountInEther)
    } else {
      setIsDisabled(true)
      setCtcCallReverted(true)
      setRevertMsg(revertMsg_)
    }
  }

  const handleSetApprovalForAll = async (e: any) => {
    e.preventDefault()

    let setApprovalForAll_: any

    setPendingUserAction(true)

    setApprovalForAll_ = await setApprovalForAll(
      true,
      collectionAddress,
      account,
      chainId,
      library
    )

    setPendingUserAction(false)

    /**
     * @todo Do the same checks for different wallets
     */
    if (setApprovalForAll_ === deniedTxMsg) {
      setPendingApprovalTxConfirmation(false)
      setCtcCallReverted(true)
      setRevertMsg(setApprovalForAll_)
    }

    if (typeof setApprovalForAll_ === 'string') {
      if (setApprovalForAll_.slice(0, 18) === executionRevertedTxMsg) {
        setPendingApprovalTxConfirmation(false)
        setCtcCallReverted(true)
        setRevertMsg(setApprovalForAll_)
      }
    } else {
      setPendingApprovalTxConfirmation(true)

      setApprovalForAll_ = await setApprovalForAll_.wait()

      if (setApprovalForAll_.status === 1) {
        setPendingApprovalTxConfirmation(false)

        const isApprovedForAll_ = await getHasApprovedForAll()

        isApprovedForAll_ === true
          ? setHasSetApprovedForAll(true)
          : setHasSetApprovedForAll(false)
      }
    }
  }

  const handleListToken = async (e: any) => {
    e.preventDefault()

    let listToken_: any

    setListTokenTxConfirmed(false) // enforce `false` state before ctc call
    setPendingUserAction(true)

    listToken_ = await listToken(
      collectionAddress,
      tokenId,
      price,
      account,
      chainId,
      library
    )

    setPendingUserAction(false)

    /**
     * @todo Do the same checks for different wallets
     */
    if (listToken_ === deniedTxMsg) {
      setPendingListTokenTxConfirmation(false)
      setCtcCallReverted(true)
      setRevertMsg(listToken_)
    }

    if (typeof listToken_ === 'string') {
      if (listToken_.slice(0, 18) === executionRevertedTxMsg) {
        setPendingListTokenTxConfirmation(false)
        setCtcCallReverted(true)
        setRevertMsg(listToken_)
      }
    } else {
      setPendingListTokenTxConfirmation(true)

      listToken_ = await listToken_.wait()

      if (listToken_.status === 1) {
        setPendingListTokenTxConfirmation(false)
        setListTokenTxConfirmed(true)
      }
    }
  }

  async function getHasApprovedForAll() {
    let isApprovedForAll_: any

    isApprovedForAll_ = await isApprovedForAll(
      collectionAddress,
      account,
      chainId,
      library
    )

    return isApprovedForAll_
  }

  /********************
   * useLayoutEffects *
   *******************/
  useLayoutEffect(() => {
    getHasApprovedForAll().then(_hasApprovedForAll => {
      setHasApprovedForAll(_hasApprovedForAll)
    })
  }, [account, chainId, library])

  /**************
   * useEffects *
   *************/
  useEffect(() => {
    setHasApprovedForAll(hasSetApprovedForAll)
    setPendingApprovalTxConfirmation(false)
    /**
     * @dev `hasSetApprovedForAll` dep is required to avoid infinite runs
     */
  }, [hasSetApprovedForAll])


  return (
    <>
      <ButtonCentering>
        {!hasApprovedForAll ? (
          <>
            <TxTernary
              conditional={pendingUserAction}
              suspenseMsg={'Waiting for you to confirm tx...'}
            >
              <TxTernary
                conditional={pendingApprovalTxConfirmation}
                suspenseMsg={'Waiting for your tx status to be confirmed on Optimism...'}
              >
                <ButtonTernary
                  conditional={true}
                  onClick={handleSetApprovalForAll}
                  defaultButtonName='Approve for all'
                />
                <InfoTooltip
                  content1={'Allow OptiMarket to handle your NFTs from this collection.'}
                  label={'Approve for All Description'}
                  questionMarkHeight={'17px'}
                />
              </TxTernary>
            </TxTernary>
          </>
        ) : (
          <>
            <TxTernary
              conditional={pendingUserAction}
              suspenseMsg={'Waiting for you to confirm tx...'}
            >
              <TxTernary
                conditional={pendingListTokenTxConfirmation}
                suspenseMsg={'Waiting for your tx status to be confirmed on Optimism...'}
              >
                <TxForm
                  formName={'list price'}
                  onSubmit={handleListToken}
                  onChange={handleSetWETHAmount}
                  revertMsg={revertMsg}
                  placeholder={'0.420 (ETH)'}
                  ctcCallReverted={ctcCallReverted}
                  inputMode={'decimal'}
                >
                  {/**
                    * @todo Handle edge case of empty inputs
                    * @todo Disable buttons until the input is valid
                    */}
                  <ButtonTernary
                    type='submit'
                    disabled={isDisabled}
                    conditional={assetListed}
                    defaultButtonName='Update list price'
                    secondaryButtonName='List token'
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


const ButtonCentering = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
`


export default ListToken
