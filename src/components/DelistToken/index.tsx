/* External imports */
import React, { memo, useCallback, useState } from 'react'

/* Internal imports */
import TxTernary from '../TxTernary'
import { ErrorMsg } from '../ErrorMsg'
import ButtonTernary from '../ButtonTernary'
import { delistToken } from '../../lib/contract-apis/marketplace'


const DelistToken = ({
  tokenId,
  account,
  chainId,
  library,
  collection,
  setDelistTokenTxConfirmed
}: any) => {
  const [revertMsg, setRevertMsg] = useState<string>('')
  const [ctcCallReverted, setCtcCallReverted] = useState<boolean>(false)
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false)
  const [
    pendingDelistTokenTxConfirmation,
    setPendingDelistTokenTxConfirmation
  ] = useState<boolean>(false)

  const deniedTxMsg = 'MetaMask Tx Signature: User denied transaction signature.'
  const executionRevertedTxMsg = 'execution reverted'

  let collectionAddress = ''

  if (chainId === 69) collectionAddress = collection.contractAddress__Kovan
  if (chainId === 10) collectionAddress = collection.contractAddress__Mainnet

  const handleDelistToken = useCallback(async (e) => {
    e.preventDefault()

    let delistToken_: any

    setDelistTokenTxConfirmed(false) // enforce `false` state before ctc call
    setPendingUserAction(true)

    delistToken_ = await delistToken(
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
    if (delistToken_ === deniedTxMsg) {
      setPendingUserAction(false) // stop loading spinner
      setCtcCallReverted(true)
      setRevertMsg(delistToken_)
    }

    if (typeof delistToken_ === 'string') {
      if (delistToken_.slice(0, 18) === executionRevertedTxMsg) {
        setPendingUserAction(false)
        setCtcCallReverted(true)
        setRevertMsg(delistToken_)
      }
    } else {
      setPendingDelistTokenTxConfirmation(true)

      delistToken_ = await delistToken_.wait()

      if (delistToken_.status === 1) {
        setPendingDelistTokenTxConfirmation(false)
        setDelistTokenTxConfirmed(true)
      }
    }
  }, [tokenId, collection, account, chainId, library])


  return (
    <>
      <TxTernary
        conditional={pendingUserAction}
        suspenseMsg='Waiting for you to confirm tx...'
      >
        <TxTernary
          conditional={pendingDelistTokenTxConfirmation}
          suspenseMsg='Waiting for your tx status to be confirmed on Optimism...'
        >
          <ButtonTernary
            conditional={true}
            onClick={handleDelistToken}
            defaultButtonName='Delist'
          />
        </TxTernary>
      </TxTernary>
      <ErrorMsg ctcCallReverted={ctcCallReverted} revertMsg={revertMsg} />
    </>
  )
}


export default DelistToken
