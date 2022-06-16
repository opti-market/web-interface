/* External imports */
import React, { useState } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'

/* Internal imports */
import { ErrorMsg } from '../ErrorMsg'
import { cancelBid, acceptBid } from '../../lib/contract-apis/marketplace'
import TxTernary from '../TxTernary'


const Offer = ({
    offer,
    buyer,
    price,
    tokenId,
    account,
    chainId,
    chainIdToLoad,
    library,
    tokenOwner,
    bidder,
    collectionAddress,
    handleReloadOffers
}: any) => {
    const [pendingUserAction, setPendingUserAction] = useState<boolean>(false)
    const [
        cancelOrAcceptBidCtcCallReverted,
        setCancelOrAcceptBidCtcCallReverted
    ] = useState<boolean>(false)
    const [
        cancelOrAcceptBidRevertMsg,
        setCancelOrAcceptBidRevertMsg
    ] = useState<string>('')
    const [
        pendingAcceptBidTxConfirmation,
        setPendingAcceptBidTxConfirmation
    ] = useState<boolean>(false)
    const [
        pendingCancelBidTxConfirmation,
        setPendingCancelBidTxConfirmation
    ] = useState<boolean>(false)

    const deniedTxMsg = 'MetaMask Tx Signature: User denied transaction signature.'
    const executionRevertedTxMsg = 'execution reverted'

    let showCancelButton: boolean = false

    /**
     * @dev offer[0] == price: BigNumber
     *      offer[1] == timestamp: BigNumber
     *      offer[2] == expiration: BigNumberv
     *      offer[3] == accepted: boolean
     *      offer[4] == buyer: string
     */
    // If the user has a Bid, show the cancel button; if not, don't show it
    if (offer[4] === account) showCancelButton = true
    
    /**
     * @dev    Accepts a bid. If it's escrowed then the weth is from the
     *         marketplace address to the seller
     * @notice It needs nft approval for all for the Marketplace contract so it
     *         can transfer the nft
     */
    const handleAcceptBid = async () => {
        let acceptBid_

        setPendingUserAction(true)

        acceptBid_ = await acceptBid(
            collectionAddress,
            tokenId,
            price,
            buyer,
            account,
            chainIdToLoad,
            library
        )

        setPendingUserAction(false)

        /**
         * @todo Do the same checks for different wallets
         */
        if (acceptBid_ === deniedTxMsg) {
            setPendingAcceptBidTxConfirmation(false) // stop loading spinner
            setCancelOrAcceptBidCtcCallReverted(true)
            setCancelOrAcceptBidRevertMsg(acceptBid_)
        }

        if (typeof acceptBid_ === 'string') {
            if (acceptBid_.slice(0, 18) === executionRevertedTxMsg) {
                setPendingAcceptBidTxConfirmation(false)
                setCancelOrAcceptBidCtcCallReverted(true)
                setCancelOrAcceptBidRevertMsg(acceptBid_)
            }
        } else {
            setPendingAcceptBidTxConfirmation(true)

            acceptBid_ = await acceptBid_.wait()

            if (acceptBid_.status === 1) {
                setPendingCancelBidTxConfirmation(false)
                handleReloadOffers()
            }
        }
    }

    /**
     * @notice Deletes a bid. If it's escrowed then the weth is transferred back
     *         to the bidder
     * @param  _ca collection's address
     * @param  _tokenId the token that it bids for
     * @param  _price the price that it wants to bid for this token
     */
    const handleCancelBid = async () => {
        let cancelBid_

        setPendingUserAction(true)

        cancelBid_ = await cancelBid(
            collectionAddress,
            tokenId,
            price,
            account,
            chainIdToLoad,
            library
        )

        setPendingUserAction(false)

        /**
         * @todo Do the same checks for different wallets
         */
        if (cancelBid_ === deniedTxMsg) {
            setPendingCancelBidTxConfirmation(false)
            setCancelOrAcceptBidCtcCallReverted(true)
            setCancelOrAcceptBidRevertMsg(cancelBid_)
        }

        if (typeof cancelBid_ === 'string') {
            if (cancelBid_.slice(0, 18) === executionRevertedTxMsg) {
                setPendingCancelBidTxConfirmation(false)
                setCancelOrAcceptBidCtcCallReverted(true)
                setCancelOrAcceptBidRevertMsg(cancelBid_)
            }
        } else {
            setPendingCancelBidTxConfirmation(true)

            cancelBid_ = await cancelBid_.wait()

            if (cancelBid_.status === 1) {
                setPendingCancelBidTxConfirmation(false)
                handleReloadOffers()
            }
        }
    }


    return (
        <>
            <TableCell key={`${offer[4]}_status`}>

                {tokenOwner ? (
                    <>
                        <TxTernary
                            conditional={pendingUserAction}
                            suspenseMsg={'Waiting for you to confirm tx...'}
                        >
                            <TxTernary
                                conditional={pendingAcceptBidTxConfirmation}
                                suspenseMsg={'Waiting for your tx to be confirmed on Optimism...'}
                            >
                                <Button onClick={handleAcceptBid} >
                                    Accept
                                </Button>
                                <ErrorMsg
                                    ctcCallReverted={cancelOrAcceptBidCtcCallReverted}
                                    revertMsg={cancelOrAcceptBidRevertMsg}
                                />
                            </TxTernary>
                        </TxTernary>
                    </>
                ) : (
                    <>
                    </>
                )}

                {showCancelButton && !tokenOwner && bidder? (
                    <TxTernary
                        conditional={pendingUserAction}
                        suspenseMsg={'Waiting for you to confirm tx...'}
                    >
                        <TxTernary
                            conditional={pendingCancelBidTxConfirmation}
                            suspenseMsg={'Waiting for your tx to be confirmed on Optimism...'}
                        >
                            <ButtonCancel onClick={handleCancelBid} >
                                Cancel
                            </ButtonCancel>
                            <ErrorMsg
                                revertMsg={cancelOrAcceptBidRevertMsg}
                                ctcCallReverted={cancelOrAcceptBidCtcCallReverted}
                            />
                        </TxTernary>
                    </TxTernary>
                ) : (
                    <>
                    </>
                )}

                {!showCancelButton && !tokenOwner ? (
                    <TableCellEmpty>
                        {`      `}
                    </TableCellEmpty>
                ) : (
                    <>
                    </>
                )}

            </TableCell>
        </>
    )
}

const TableCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 50px;
`

const TableCellEmpty = styled.div`
  text-align: center;
  width: 10px;

  border-radius: 3rem;
  background-color: transparent;

`

const Button = styled.button`
  text-align: center;
  justify-content: center;

  padding: 5px 10px;

  border-radius: 3rem;
  border-outline: none;
  border-style: none;

  background-color: ${ ({ theme }) => theme.green1 };

  :hover {
    background-color: ${ ({ theme }) => darken(0.1, theme.green1) };
    transform: scale(1.02);
    cursor: pointer;
  }

  :active {
    transform: scale(0.97);
  }

  font-weight: 500;
  font-size: 16px;
  color: ${ ({ theme }) => theme.white };
`

const ButtonCancel = styled(Button)`
    background-color: ${ ({ theme }) => theme.primary1 };

    :hover {
        background-color: ${ ({ theme }) => darken(0.1, theme.primary1) };
        transform: scale(1.02);
        cursor: pointer;
    }
`

export default Offer
