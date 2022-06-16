/* External imports */
import React, {
  useState,
  useLayoutEffect,
  useEffect
} from 'react'
import { ethers } from 'ethers'
import styled from 'styled-components'

/* Internal imports */
import FeesInfo from '../FeesInfo'
import TxTernary from '../TxTernary'
import ButtonTernary from '../ButtonTernary'
import InsuffientWETH from '../InsufficientWETH'
import { EXTERNAL_LINKS } from '../../constants/links'
import { purchaseListing } from '../../lib/contract-apis/marketplace'
import { approveWETH9, allowance } from '../../lib/contract-apis/weth9'



/**
 * @todo `Bid` component looks to have too many arguments. Make sure that there
 *       is nothing in this component that can be decoupled.
 */
const BuyToken = ({
  account,
  chainId,
  library,
  tokenId,
  openBuyToken,
  revertMsg,
  collection,
  wethBalance,
  assetListed,
  allowance_,
  setRevertMsg,
  setAllowance,
  getWETHBalance,
  ctcCallReverted,
  setOpenBuyToken,
  setHideBidButton,
  currentListPrice,
  approvedAllowance,
  setCtcCallReverted,
  setApprovedAllowance,
  setPurchaseListingTxConfirmed
}: any) => {
  currentListPrice = ethers.utils.parseEther(currentListPrice)

  // Suspense states
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false)
  const [
    pendingApprovalTxConfirmation,
    setPendingApprovalTxConfirmation
  ] = useState<boolean>(false)
  const [
    pendingPurchaseListingTxConfirmation,
    setPendingPurchaseListingTxConfirmation
  ] = useState<boolean>(false)
  const [fetchingAllowance, setFetchingAllowance] = useState<boolean>(false)

  // Revert messages
  const executionRevertedTxMsg = 'execution reverted'
  const deniedTxMsg = 'MetaMask Tx Signature: User denied transaction signature.'

  const goBackButtonStyle = {
    justifyContent: 'center',
    alignSelf: 'center',
    cursor: 'pointer'
  }

  let collectionAddress = ''

  if (chainId === 69) collectionAddress = collection.contractAddress__Kovan
  if (chainId === 10) collectionAddress = collection.contractAddress__Mainnet

  let UNISWAP_URL = '',
    ZIPSWAP_URL = ''

  if (chainId === 69) {
    UNISWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-kovan'].Uniswap
    ZIPSWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-kovan'].ZipSwap
  }

  if (chainId === 10) {
    UNISWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-mainnet'].Uniswap
    ZIPSWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-mainnet'].ZipSwap
  }

  const handleApproveWETH = async (e: any) => {
    e.preventDefault()

    let approveWETH9_: any,
      formattedWad = currentListPrice

    setPendingUserAction(true)

    approveWETH9_ = await approveWETH9(
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
  // , [currentListPrice, account, chainId, library])


  const handleBuyToken = async (e: any) => {
    e.preventDefault()

    let purchaseListing_: any

    //    * @notice purchaseListing() allows a buyer to buy at the LISTED PRICE if it's normal purchase
    //    *         or at a certain price based on the time he purchases in case of a DUTCH AUCTION.
    /**   @dev @TODO Add DUTCH AUCTION logic in here  */

    //    * @dev it needs weth approval for the token's price
    //    * @param _ca collection's address
    //    * @param _tokenId the token id that needs to be purchased

    setPurchaseListingTxConfirmed(false)
    setPendingUserAction(true)

    purchaseListing_ = await purchaseListing(
      collectionAddress,
      tokenId,
      account,
      chainId,
      library
    )

    setPendingUserAction(false)

    /**
     * @todo Do the same checks for different wallets
     */
    if (purchaseListing_ === deniedTxMsg) {
      setPendingPurchaseListingTxConfirmation(false)
      setCtcCallReverted(true)
      setRevertMsg(purchaseListing_)
    }

    if (typeof purchaseListing_ === 'string') {
      if (purchaseListing_.slice(0, 18) === executionRevertedTxMsg) {
        setPendingPurchaseListingTxConfirmation(false)
        setCtcCallReverted(true)
        setRevertMsg(purchaseListing_)
      }
    } else {
      setPendingPurchaseListingTxConfirmation(true)

      purchaseListing_ = await purchaseListing_.wait()

      if (purchaseListing_.status === 1) {
        setPendingPurchaseListingTxConfirmation(false)
        setPurchaseListingTxConfirmed(true)
      }
    }
  }

  const handleGoBack = () => {
    getWETHBalance()
    setPurchaseListingTxConfirmed(true)
  }

  function getAllowance() {
    allowance(account, chainId, library).then((_allowance: any) => {
      // Only set the allowance if it is > 0 and it changed
      if (_allowance.gt(0) && !_allowance.eq(allowance_))
        setAllowance(_allowance)
      if(fetchingAllowance) setFetchingAllowance(false)
    })
  }

  useLayoutEffect(() => {
    if (assetListed && account && openBuyToken && !fetchingAllowance 
    && allowance_.lt(currentListPrice)) {
        setFetchingAllowance(true)
        getAllowance()
    }
  }, [currentListPrice, assetListed, account, chainId, library])


  useEffect(() => {
    if (account && openBuyToken)
      setAllowance(approvedAllowance)
  }, [account, approvedAllowance])

  return (
    <>
      <ButtonCentering>
        {allowance_ &&
          currentListPrice &&
          allowance_.lt(currentListPrice) ? (
          <>
            <TxTernary
              conditional={pendingUserAction}
              suspenseMsg='Waiting for you to confirm tx...'
            >
              <TxTernary
                conditional={pendingApprovalTxConfirmation}
                suspenseMsg='Waiting for your tx status to be confirmed on Optimism...'
              >
                <ButtonTernary
                  conditional={true}
                  onClick={handleApproveWETH}
                  defaultButtonName='Approve WETH'
                />
              </TxTernary>
            </TxTernary>
          </>
        ) : (
          <>
            {/**
              * @dev The ternary below is repeated in the `Bid` component, so
              *      we should turn this into its own reusable component.
              */}
            {(wethBalance.lt(currentListPrice) &&
              approvedAllowance.eq(0)) ||
              (wethBalance.lt(currentListPrice) &&
                approvedAllowance.gt(0)) ? (
              <>
                <InsuffientWETH
                  onClick={()=>handleGoBack()}
                  wethAmount={currentListPrice}
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
                    conditional={pendingPurchaseListingTxConfirmation}
                    suspenseMsg='Waiting for your tx status to be confirmed on Optimism...'
                  >
                    <ButtonTernary
                      conditional={true}
                      onClick={handleBuyToken}
                      defaultButtonName='Buy Now'
                    />
                    <FeesInfo collection={collection} chainId={chainId} />
                  </TxTernary>
                </TxTernary>
              </>
            )}
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


export default BuyToken;