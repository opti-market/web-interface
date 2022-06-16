/* External imports */
import React, {
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import {ethers} from 'ethers'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {useParams, Link} from 'react-router-dom'
import {BigNumber} from '@ethersproject/bignumber'

/* Internal imports */
import Bid from '../Bid'
import TxForm from '../TxForm'
import BuyToken from '../BuyToken'
import {Text} from '../Web3Status'
import ListToken from '../ListToken'
import TxTernary from '../TxTernary'
import DelistToken from '../DelistToken'
import {StyledAnchor} from '../../theme'
import ButtonTernary from '../ButtonTernary'
import WhiteListIcon from '../WhiteListIcon'
import NetworkWarning from '../NetworkWarning'
import {Web3StatusConnect} from '../Web3Status'
import BidList, {findDateTimeDiff} from '../BidList'
import {ErrorMsg, TransferErrorMsg} from '../ErrorMsg'
import {TransferButton} from '../Button/TransferButton'
import {EXTERNAL_LINKS} from '../../constants/links'
import {
  getMetadata,
  initZero,
  whitelist,
  findCollection,
  tokenImageURL,
  WhitelistInterface
} from '../../utils/utils'
import {
  allowance,
  balanceOf
} from '../../lib/contract-apis/weth9'
import {
  isListed,
  getCurrentListingPrice
} from '../../lib/contract-apis/marketplace'
import CoreAppSuspense from '../Suspense/CoreAppSuspense'
import {ownerOf, transferFrom} from '../../lib/contract-apis/erc721'
import {useWalletModalToggle} from '../../state/application/hooks'
import EthereumLogo from '../../assets/images/ethereum-logo.svg'
import {
  queryTokenPurchasedsForTokenID,
  queryTokenListedsForTokenID,
  queryTokenDelistedsForTokenID
} from '../../utils/graphql/apolloClient'
import {
  ftedFromMultipleQueries,
  ftedFromSingleQuery
} from '../../utils/graphql/fetchTokenEventData'
import formatPriceToETH from '../../lib/ethers/formatETH'


/**
 * @dev Function component
 */
const AssetDetails = ({
  account,
  chainId,
  library,
  isNotOnOptimism
}: any) => {
  const {collectionSlug, tokenId} = useParams() // Page params
  // anys
  const [collection_, setCollection_]: any = useState({slug: ''})
  // strings
  const [revertMsg, setRevertMsg] = useState<string>('')
  const [recipient, setRecipient] = useState<string>('')
  const [transferRevertMsg, setTransferRevertMsg] = useState<string>('')
  // booleans
  const [openBid, setOpenBid] = useState<boolean>(false)
  const [showStats, setShowStats] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [tokenOwner, setTokenOwner] = useState<boolean>(false)
  const [assetListed, setAssetListed] = useState<boolean>(false)
  const [openBuyToken, setOpenBuyToken] = useState<boolean>(false)
  const [openListToken, setOpenListToken] = useState<boolean>(false)
  const [hideBidButton, setHideBidButton] = useState<boolean>(false)
  const [tokenDataLoaded, setTokenDataLoaded] = useState<boolean>(false)
  const [openDelistToken, setOpenDelistToken] = useState<boolean>(false)
  const [ctcCallReverted, setCtcCallReverted] = useState<boolean>(false)
  const [hideDelistToken, setHideDelistToken] = useState<boolean>(false)
  const [openTransferFrom, setOpenTransferFrom] = useState<boolean>(false)
  const [userHasActiveBid, setUserHasActiveBid] = useState<boolean>(false)
  const [hideBuyTokenButton, setHideBuyTokenButton] = useState<boolean>(false)
  // Subgraph query states
  const [activityTableData, setActivityTableData] = useState<any>([])
  const [
    tradeVolumeData,
    setTradeVolumeData
  ] = useState<any>([])
  // Ternaries
  const [hideListTokenButton, setHideListTokenButton] = useState<boolean>(false)
  const [
    transferCallReverted,
    setTransferCallReverted
  ] = useState<boolean>(false)
  const [currentListPrice, setCurrentListPrice] = useState<BigNumber>(initZero)
  // Suspense states
  const [hideActivity, setHideActivity] = useState<boolean>(true)
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(true)
  const [bidTxConfirmed, setBidTxConfirmed] = useState<boolean>(false)
  const [userDataLoaded, setUserDataLoaded] = useState<boolean>(false)
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false)
  const [
    listTokenTxConfirmed,
    setListTokenTxConfirmed
  ] = useState<boolean>(false)
  const [
    transferFromTxConfirmed,
    setTransferFromTxConfirmed
  ] = useState<boolean>(false)
  const [
    delistTokenTxConfirmed,
    setDelistTokenTxConfirmed
  ] = useState<boolean>(false)
  const [
    purchaseListingTxConfirmed,
    setPurchaseListingTxConfirmed
  ] = useState<boolean>(false)
  const [
    pendingTransferFromTxConfirmation,
    setPendingTransferFromTxConfirmation
  ] = useState<boolean>(false)
  // Allowance states 
  const [allowance_, setAllowance] = useState<BigNumber>(initZero)
  const [wethBalance, setWETHBalance] = useState<BigNumber>(initZero)
  const [
    approvedAllowance,
    setApprovedAllowance
  ] = useState<BigNumber>(initZero)
  // Metadata state 
  const [metadata, setMetadata] = useState({
    attributes: [
      {
        trait_type: "",
        value: ""
      }
    ]
  })
  const [metadataLoaded, setMetadataLoaded] = useState<boolean>(false)

  const {t} = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  const tableHeaders = [
    'Event',
    'Price',
    'From',
    'To',
    'Date'
  ]

  // Sets the collection for AssetDetails if blank
  // Note that findCollection allows this component to access the data instantly
  let collection: any = collection_

  if (collection_.slug == '') {
    collection = findCollection(whitelist, collectionSlug) as WhitelistInterface
    setCollection_(collection)
  }

  let chainIdToLoad = chainId
  /** @dev This conditional sets the default chainId = 10 **/
  // This applies to both AssetDetails and BidList
  if (chainId !== 69 && chainId !== 10) chainIdToLoad = 10

  let collectionAddress = '',
    UNISWAP_URL = '',
    ZIPSWAP_URL = ''

  if (chainIdToLoad === 69) {
    collectionAddress = collection.contractAddress__Kovan
    UNISWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-kovan'].Uniswap
    ZIPSWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-kovan'].ZipSwap
  }
  else if (chainIdToLoad === 10) {
    collectionAddress = collection.contractAddress__Mainnet
    UNISWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-mainnet'].Uniswap
    ZIPSWAP_URL = EXTERNAL_LINKS.DEXs.SwapETHforWETH['optimism-mainnet'].ZipSwap
  }

  // Revert messages
  const executionRevertedTxMsg = 'execution reverted'
  const deniedTxMsg = 'MetaMask Tx Signature: User denied transaction signature.'
  // Component prop values
  const collectionTitle = `${ collection.asset_name_prefix } #${ tokenId }`
  const imgSrc = tokenImageURL(tokenId, collection)

  /************************
   * Functional functions *
   ***********************/
  const handleSetRecipient = (e) => {
    let recipient_

    recipient_ = e.currentTarget.value

    const revertMsg1_ = `Recipient address must start with "0x"!`
    const revertMsg2_ = 'Recipient address must have a length of 42 characters!'

    if (recipient_.length === 42) {
      setTransferCallReverted(false)

      if (recipient_.substring(0, 2) === '0x') {
        setIsDisabled(false)
        setRecipient(recipient_)
      } else {
        setIsDisabled(true)
        setTransferCallReverted(true)
        setTransferRevertMsg(revertMsg1_)
      }
    } else {
      setIsDisabled(true)
      setTransferCallReverted(true)
      setTransferRevertMsg(revertMsg2_)
    }
  }

  const handleTransfer = async (e: any) => {
    e.preventDefault()

    if (!recipient) {
      setIsDisabled(true)
      setTransferCallReverted(true)
      setTransferRevertMsg('Cannot transfer to null address!')
    } else {
      let transferFrom_: any,
        tokenId_: any = tokenId

      setTransferFromTxConfirmed(false)
      setPendingUserAction(true)

      transferFrom_ = await transferFrom(
        collection,
        tokenId_,
        recipient,
        account,
        chainId,
        library
      )

      setPendingUserAction(false)

      /**
       * @todo Do the same checks for different wallets
       */
      if (transferFrom_ === deniedTxMsg) {
        setPendingTransferFromTxConfirmation(false) // stop loading spinner
        setTransferCallReverted(true)
        setRevertMsg(transferFrom_)
      }

      if (typeof transferFrom_ === 'string') {
        if (transferFrom_.slice(0, 18) === executionRevertedTxMsg) {
          setPendingTransferFromTxConfirmation(false)
          setTransferCallReverted(true)
          setRevertMsg(transferFrom_)
        }
      } else {
        setPendingTransferFromTxConfirmation(true)

        transferFrom_ = await transferFrom_.wait()

        if (transferFrom_.status === 1) {
          setPendingTransferFromTxConfirmation(false)
          setTransferFromTxConfirmed(true)
        }
      }
    }
  }

  /***************************
   * Regular async functions *
   **************************/
  async function getIsListed() {
    let tokenId_: any = tokenId

    const isListed_: any = await isListed(
      collectionAddress,
      tokenId_,
      account,
      chainIdToLoad
    )

    setAssetListed(isListed_)

    if (isListed_) fetchCurrentListPrice()

    return isListed_
  }

  async function fetchCurrentListPrice() {
    let tokenId_: any = tokenId,
      currentListPrice_: any

    currentListPrice_ = await getCurrentListingPrice(
      collectionAddress,
      tokenId_,
      chainIdToLoad
    )

    currentListPrice_ = ethers.utils.formatEther(currentListPrice_)

    setCurrentListPrice(currentListPrice_)

    return currentListPrice_
  }

  async function getIsTokenOwner() {
    let tokenId_: any = tokenId,
      ownerOf_ = await ownerOf(collection, tokenId_, chainIdToLoad, library)

    /**
     * @todo Do the same checks for different wallets
     */
    if (ownerOf_ === undefined) {
      setTokenOwner(false)
      setCtcCallReverted(true)
      setRevertMsg(ownerOf_)
    }

    if (typeof ownerOf_ === 'string') {
      if (ownerOf_.slice(0, 2) === '0x') {
        let tokenOwner_: boolean = false
        if (account) tokenOwner_ = (ownerOf_ === account)
        setTokenOwner(tokenOwner_)
      }
    }

    return ownerOf_
  }

  async function getWETHBalance() {
    let balanceOf_ = await balanceOf(account, chainId, library)
    if (balanceOf_ === deniedTxMsg) {
      setCtcCallReverted(true)
      setRevertMsg(balanceOf_)
    }

    if (typeof balanceOf_ === 'string') {
      if (balanceOf_.slice(0, 18) === executionRevertedTxMsg) {
        setCtcCallReverted(true)
        setRevertMsg(balanceOf_)
      }
    } else {
      if (balanceOf_ === undefined) {
        setWETHBalance(initZero)
      } else {
        setWETHBalance(balanceOf_)
      }
    }
    return balanceOf_
  }

  /*********************
   * Regular functions *
   ********************/
  /**
   * @dev     This function is only used for multidimensional arrays that are 
   *          returned from the `fetchDataFromMultipleQueries` function.
   * @notice  This function is only used to sort the sub-arrays.
   */
  function sortSubArrays(_array: any) {
    _array.sort(
      (a, b) => {
        if (a[0] !== undefined && b[0] !== undefined) {
          if (a[0]._timestamp !== undefined && b[0]._timestamp !== undefined) {

            const TIMESTAMP_A = Number(parseFloat(a[0]._timestamp))
            const TIMESTAMP_B = Number(parseFloat(b[0]._timestamp))

            if (TIMESTAMP_A === TIMESTAMP_B) {
              return b[0]._timestamp - a[0]._timestamp
            }

            return b[0]._timestamp - a[0]._timestamp
          }
        }
      }
    )

    return _array
  }

  function useOpenListToken() {
    setCtcCallReverted(false)
    setOpenListToken(!openListToken)
    setHideDelistToken(!hideDelistToken)
  }

  function useOpenDelistToken() {
    setCtcCallReverted(false)
    setOpenDelistToken(!openDelistToken)
    setHideListTokenButton(!hideListTokenButton)
  }

  function useOpenTransferFrom() {
    setCtcCallReverted(false)
    setOpenTransferFrom(!openTransferFrom)
  }

  function useOpenBid() {
    setCtcCallReverted(false)
    setOpenBid(!openBid)
    setHideBuyTokenButton(!hideBuyTokenButton)
  }

  function useOpenBuyToken() {
    setCtcCallReverted(false)
    setOpenBuyToken(!openBuyToken)
    setHideBidButton(!hideBidButton)
  }

  /********************
   * useLayoutEffects *
   *******************/
  useLayoutEffect(() => {
    setDataIsLoading(true)

    if (collection.contract_type === "non-fungible") {
      getMetadata(collection, tokenId, setMetadata)
      setMetadataLoaded(true)
    }

    const _tokenId: any = tokenId

    const fetchActivityTableData = ftedFromMultipleQueries(
      setActivityTableData,
      ['tokenPurchaseds', 'tokenListeds', 'tokenDelisteds'],
      [
        queryTokenPurchasedsForTokenID,
        queryTokenListedsForTokenID,
        queryTokenDelistedsForTokenID
      ],
      _tokenId
    )

    const fetchTradeVolumeData = ftedFromSingleQuery(
      setTradeVolumeData,
      'tokenPurchaseds',
      queryTokenPurchasedsForTokenID,
      _tokenId
    )

    Promise.all([
      getIsTokenOwner(),
      getIsListed(),
      fetchTradeVolumeData,
      fetchActivityTableData,
    ]).then(response => {
      setTokenDataLoaded(true)
    })

    // Load this if the user connected a wallet
    if (account && (chainId === 10 || chainId === 69)) {
      Promise.all([
        // Get the users WETH balance and allowance
        getWETHBalance(),
        allowance(account, chainId, library).then((_allowance: any) => {
          setApprovedAllowance(_allowance)

          return _allowance
        })
      ]).then(response => {
        if (activityTableData !== undefined) activityTableData.reverse()
        setUserDataLoaded(true)
      })
    } else if (!account || (chainId !== 10 && chainId !== 69)) {
      if (activityTableData !== undefined) activityTableData.reverse()
      setUserDataLoaded(true)
    }
  }, [tokenId, account, chainId, library])


  useLayoutEffect(() => {
    // Note that if userDataLoaded = false, that means Buy/Bid are disabled
    if (
      tokenDataLoaded && userDataLoaded && (!assetListed ||
        (assetListed && (currentListPrice !== initZero)))
    ) {
      setHideActivity(false)
      setDataIsLoading(false)
      setTokenDataLoaded(false)
      setUserDataLoaded(false)
    }
  }, [
    tokenId,
    tokenDataLoaded,
    userDataLoaded,
    assetListed,
    currentListPrice,
    hideActivity,
    account,
    chainId,
    library
  ])

  /**************
   * useEffects *
   *************/
  useEffect(() => {
    if (chainId === 10 || chainId === 69) {
      if (bidTxConfirmed) {
        setOpenBid(false)
        setHideBidButton(false)
        setUserHasActiveBid(true)
      }

      if (listTokenTxConfirmed) {
        getIsListed()

        setOpenListToken(false)
        setHideDelistToken(false)
        setListTokenTxConfirmed(false)
      }

      if (delistTokenTxConfirmed) {
        getIsListed()

        setOpenDelistToken(false)
        setHideDelistToken(false)
        setHideListTokenButton(false)
        setDelistTokenTxConfirmed(false)
      }

      if (purchaseListingTxConfirmed) {
        getIsTokenOwner()
        getIsListed()

        setOpenBuyToken(false)
        setHideBidButton(false)
        setPurchaseListingTxConfirmed(false)
      }

      if (transferFromTxConfirmed) {
        getIsTokenOwner()
        setTransferFromTxConfirmed(false)
      }
    }
  }, [
    bidTxConfirmed,
    listTokenTxConfirmed,
    delistTokenTxConfirmed,
    purchaseListingTxConfirmed,
    transferFromTxConfirmed
  ])

  return (
    <>
      <CenterAll
        className={collection.name === 'EthernautDAO' ? 'Ethernaut' : ''}
      >
        <TokenColumn>
          <Img src={imgSrc} alt='Asset' />
          {dataIsLoading ? (
            <>
              <CoreAppSuspense />
            </>
          ) : (
            <>
              {metadataLoaded ? (
                <TraitWrap>
                  {metadata.attributes.map((attributeObj, i) => (
                    <TraitBox key={`metadata${ i }`}>
                      <TraitType>{attributeObj.trait_type}</TraitType>
                      <TraitValue>{attributeObj.value}</TraitValue>
                    </TraitBox>
                  ))}
                </TraitWrap>
              ) : ''}
            </>
          )}
        </TokenColumn>

        <BuyColumn>
          {dataIsLoading ? (
            <>
              <CoreAppSuspense />
            </>
          ) : (
            <>
              <AlignTitles>
                <LinkWrap>
                  <LinkStyle to={`/collection/${ collectionSlug }`}>
                    {collection.name}
                  </LinkStyle>
                  <IconWrap>
                    <WhiteListIcon />
                  </IconWrap>
                </LinkWrap>
                <TitleWrap>{collectionTitle}</TitleWrap>
              </AlignTitles>

              {/**
                * @dev When IS owner
                *      1. Shows `Transfer` components
                */}
              {tokenOwner ? (
                <>
                  <AlignColumns>
                    {openTransferFrom ? (
                      <>
                        <TxTernary
                          conditional={pendingUserAction}
                          suspenseMsg={'Waiting for you to confirm tx...'}
                        >
                          <TxTernary
                            conditional={pendingTransferFromTxConfirmation}
                            suspenseMsg='Waiting for your tx to be confirmed on Optimism...'
                          >
                            <TransferButtonPosition>
                              <TxForm
                                inputMode='text'
                                revertMsg={revertMsg}
                                formName={'recipient'}
                                onSubmit={handleTransfer}
                                onChange={handleSetRecipient}
                                placeholder={'Recipient address'}
                                ctcCallReverted={ctcCallReverted}
                              >
                                <TransferButton
                                  type='submit'
                                  disabled={isDisabled}
                                  buttonName={'Transfer'}
                                />
                              </TxForm>
                            </TransferButtonPosition>
                          </TxTernary>
                          <TransferErrorMsg
                            transferRevertMsg={transferRevertMsg}
                            transferCallReverted={transferCallReverted}
                          />
                        </TxTernary>
                      </>
                    ) : (
                      <>
                        {assetListed ? <></> :
                          <TransferButton
                            type='button'
                            buttonName='Transfer'
                            onClick={useOpenTransferFrom}
                          />
                        }
                      </>
                    )}
                  </AlignColumns>
                </>
              ) : (
                <>
                </>
              )}


              <GlowCard>
                <InfoBoxTitle>Current price</InfoBoxTitle>
                <PriceWrap>
                  {assetListed ? (
                    <>
                      <EthLogo src={EthereumLogo} />
                      {`${ currentListPrice } ETH`}
                    </>
                  ) : (
                    <div>Not Listed</div>
                  )}
                </PriceWrap>

                {openListToken && !hideListTokenButton ? (
                  <>
                    <ListToken
                      account={account}
                      chainId={chainId}
                      library={library}
                      tokenId={tokenId}
                      revertMsg={revertMsg}
                      collection={collection}
                      allowance_={allowance_}
                      assetListed={assetListed}
                      wethBalance={wethBalance}
                      setAllowance={setAllowance}
                      setRevertMsg={setRevertMsg}
                      getWETHBalance={getWETHBalance}
                      ctcCallReverted={ctcCallReverted}
                      currentListPrice={currentListPrice}
                      approvedAllowance={approvedAllowance}
                      setCtcCallReverted={setCtcCallReverted}
                      setApprovedAllowance={setApprovedAllowance}
                      setListTokenTxConfirmed={setListTokenTxConfirmed}
                    />
                  </>
                ) : (
                  <>
                    <ButtonCentering>
                      {tokenOwner ? (
                        <>
                          <ButtonTernary
                            conditional={assetListed}
                            onClick={useOpenListToken}
                            secondaryButtonName={'Sell'}
                            defaultButtonName={'Change list price'}
                          />
                        </>
                      ) : (
                        <>
                        </>
                      )}
                    </ButtonCentering>
                  </>
                )}


                {/**
                  * @dev 1. If wallet is connected AND wrong chain, 
                  *         show network warning  
                  *      2. If wallet is not connected, show connect button
                  */}
                {account ? (
                  <>
                    {isNotOnOptimism ? (
                      <>
                        <NetworkWarning
                          messageType={'short'}
                        />
                      </>
                    ) : ''}
                  </>
                ) : (
                  <Web3StatusConnect
                    id="connect-wallet"
                    onClick={toggleWalletModal}
                    faded={!account}
                  >
                    <Text>{t('Connect to a wallet')}</Text>
                  </Web3StatusConnect>
                )}


                {/**
                  * @dev When IS listed and NOT owner and wallet connected
                  *      1. Shows `BuyToken` components
                  *      2. Shows `Bid` components
                  */}
                {account && !tokenOwner && !isNotOnOptimism ? (
                  <>
                    {assetListed ? (
                      <>
                        {openBuyToken && !hideBuyTokenButton ? (
                          <BuyToken
                            account={account}
                            chainId={chainId}
                            library={library}
                            tokenId={tokenId}
                            revertMsg={revertMsg}
                            collection={collection}
                            allowance_={allowance_}
                            assetListed={assetListed}
                            wethBalance={wethBalance}
                            setRevertMsg={setRevertMsg}
                            setAllowance={setAllowance}
                            openBuyToken={openBuyToken}
                            getWETHBalance={getWETHBalance}
                            ctcCallReverted={ctcCallReverted}
                            setOpenBuyToken={setOpenBuyToken}
                            setHideBidButton={setHideBidButton}
                            currentListPrice={currentListPrice}
                            approvedAllowance={approvedAllowance}
                            setCtcCallReverted={setCtcCallReverted}
                            setApprovedAllowance={setApprovedAllowance}
                            setPurchaseListingTxConfirmed={setPurchaseListingTxConfirmed}
                          />
                        ) : (
                          <ButtonTernary
                            onClick={useOpenBuyToken}
                            conditional={true}
                            defaultButtonName={'Buy'}
                          />
                        )}
                      </>
                    ) : ''}

                    {openBid && !hideBidButton ? (
                      <Bid
                        tokenId={tokenId}
                        account={account}
                        chainId={chainId}
                        library={library}
                        openBid={openBid}
                        revertMsg={revertMsg}
                        collection={collection}
                        allowance_={allowance_}
                        wethBalance={wethBalance}
                        setRevertMsg={setRevertMsg}
                        setAllowance={setAllowance}
                        getWETHBalance={getWETHBalance}
                        ctcCallReverted={ctcCallReverted}
                        userHasActiveBid={userHasActiveBid}
                        approvedAllowance={approvedAllowance}
                        setBidTxConfirmed={setBidTxConfirmed}
                        setCtcCallReverted={setCtcCallReverted}
                        setApprovedAllowance={setApprovedAllowance}
                      />
                    ) : (
                      <ButtonTernary
                        onClick={useOpenBid}
                        conditional={userHasActiveBid}
                        defaultButtonName={'Change offer'}
                        secondaryButtonName={'Make offer'}
                      />
                    )}
                  </>
                ) : ''}


                {/**
                  * @dev When IS listed and NOT owner
                  *      1. Shows `Delist` components only
                  */}
                {assetListed && tokenOwner && !hideDelistToken ? (
                  <>
                    {openDelistToken ? (
                      <DelistToken
                        tokenId={tokenId}
                        account={account}
                        chainId={chainId}
                        library={library}
                        collection={collection}
                        setDelistTokenTxConfirmed={setDelistTokenTxConfirmed}
                      />
                    ) : (
                      <ButtonTernary
                        onClick={useOpenDelistToken}
                        conditional={true}
                        defaultButtonName={'Delist token'}
                        secondaryButtonName={'Make offer'}
                      />
                    )}
                  </>
                ) : ''}

                {/**
                  * @dev Shown if a contract call made from one of the ternaries
                  *      above returns error message.
                  */}
                <ErrorMsg
                  ctcCallReverted={ctcCallReverted}
                  revertMsg={revertMsg}
                />
              </GlowCard>
            </>
          )}

        </BuyColumn>
      </CenterAll>


      {/** 
       * @todo Refactor the `Activity` table into its own component
       */}
      {hideActivity ? '' : (
        <>
          <ActivityColumn>
            {/**
              * @todo Make Activity card scrollable so that ppl don't have
              *       see a v ugly and long card on the UI.
              */}
            <GlowCard className={'activity'}>
              <InfoBoxTitle>Activity</InfoBoxTitle>
              <ActivityTable>
                <ActivityTableTitles>
                  {tableHeaders.map((header) => (
                    <ActivityTableTitle>
                      {header}
                    </ActivityTableTitle>
                  ))}
                </ActivityTableTitles>
                {sortSubArrays(activityTableData).map(
                  (singleEventArray: any) => (singleEventArray.map(
                    (ed: any) => ( // ed === eventData
                      <>
                        <ActivityRow>
                          <ActivityCell>
                            {ed.__typename === 'TokenDelisted' ? 'Delisted' : ''}
                            {ed.__typename === 'TokenPurchased' ? 'Sale' : ''}
                            {ed.__typename === 'TokenListed' ? 'Listed' : ''}
                          </ActivityCell>
                          {/**
                            * @todo Format the timestamp so that it reads how long
                            *       ago the transaction was made
                            */}
                          <ActivityCell>
                            {ed.__typename === 'TokenDelisted' ? '-' : ''}
                            {ed.__typename === 'TokenPurchased' ? `${ formatPriceToETH(ed) } ETH` : ''}
                            {ed.__typename === 'TokenListed' ? `${ formatPriceToETH(ed) } ETH` : ''}
                          </ActivityCell>
                          <ActivityCell>
                            {ed.__typename === 'TokenDelisted' ? '-' : ''}
                            {ed.__typename === 'TokenPurchased' ?
                              <StyledAnchor href={`https://optimistic.etherscan.io/address/${ ed._oldOwner }`} target='_blank'>
                                {`${ ed._oldOwner.slice(0, 5) }...${ ed._oldOwner.slice(ed._oldOwner.length - 4) }`}
                              </StyledAnchor>
                              : ''}
                            {ed.__typename === 'TokenListed' ? `-` : ''}
                          </ActivityCell>
                          <ActivityCell>
                            {ed.__typename === 'TokenDelisted' ? '-' : ''}
                            {ed.__typename === 'TokenPurchased' ?
                              <StyledAnchor href={`https://optimistic.etherscan.io/address/${ ed._newOwner }`} target='_blank'>
                                {`${ ed._newOwner.slice(0, 5) }...${ ed._newOwner.slice(ed._newOwner.length - 4) }`}
                              </StyledAnchor>
                              : ''
                            }
                            {ed.__typename === 'TokenListed' ? `-` : ''}
                          </ActivityCell>
                          <ActivityCell>
                            <StyledAnchor href={`https://optimistic.etherscan.io/tx/${ ed._txHash }`} target='_blank'>
                              {`${ findDateTimeDiff(ed._timestamp * 1000, new Date()).slice(0, findDateTimeDiff(ed._timestamp * 1000, new Date()).indexOf('s') + 1) } ago`}
                            </StyledAnchor>
                          </ActivityCell>
                        </ActivityRow>
                      </>
                    ))
                  )
                )}
              </ActivityTable>
            </GlowCard>
          </ActivityColumn>
        </>
      )}

      <BidList
        account={account}
        chainId={chainId}
        chainIdToLoad={chainIdToLoad}
        library={library}
        tokenId={tokenId}
        tokenOwner={tokenOwner}
        getIsTokenOwner={getIsTokenOwner}
        getIsListed={getIsListed}
        collection={collection}
        assetListed={assetListed}
        collectionAddress={collectionAddress}
        bidTxConfirmed={bidTxConfirmed}
        setCtcCallReverted={setCtcCallReverted}
        setUserHasActiveBid={setUserHasActiveBid}
      />
    </>
  )
}


const ActivityTableTitle = styled.div`
  padding: 5px;
  margin: 0px 0px 0px -23px;

  font-weight: 700;
  font-size: 16px;
`

/**
 * @todo Prettier CSS
 */
const ActivityTableTitles = styled.div`
  display: grid;
  grid-gap: 0px;

  grid-template-columns: repeat(5, 1fr);

  margin: 0px 0px 0px 24px;
`

/**
 * @todo Prettier CSS
 */
const ActivityTable = styled.div`  
  text-align: center;
`

/**
 * @todo Prettier CSS
 */
const ActivityRow = styled.div`
  display: grid;
  grid-gap: 0px;
  
  grid-template-columns: repeat(5, 1fr);

  margin: 10px 0px 0px 0px;
  padding: 10px;

  border: 1px solid ${ ({theme}) => theme.bg4 };
  border-radius: 3rem;
  border-width: 2px;
`

/**
 * @todo Prettier CSS
 */
const ActivityCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const ActivityColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;
`

const AlignTitles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
`

const AlignColumns = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
`

const CenterAll = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${ ({theme}) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};

  @media only screen and (max-width: 1200px) {
    flex-direction: ${ props => props.className ? "column" : "" };
  }
`

const TokenColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: normal;
  align-items: center;
  
  margin: 30px;
`

const Img = styled.img`
  display: flex;
  
  margin-bottom: 10px;
  
  border-width: 1px;
  border-radius: 35px;
  
  height: 350px;
  width: auto;

  ${ ({theme}) => theme.mediaWidth.upToSmall`
    height: auto;
    max-width: 80%;
    text-align: center;
  `};
`

const TraitWrap = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr;

  ${ ({theme}) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr 1fr;
  `};
`

const TraitBox = styled.div`
  border-width: 0;
  border-radius: 3rem;
  
  border-color: ${ ({theme}) => theme.white };
  background-color: ${ ({theme}) => theme.bg1 };
  
  text-align: center;
  
  padding: 10px 0px;
  margin: 12px;
  
  width: 150px;
  
  box-shadow: .02rem 0.5rem 2rem ${ ({theme}) => theme.text2 };

  :hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 0.1rem ${ ({theme}) => theme.primary2 });
  }
`

const TraitType = styled.div`
  font-size: 13px;
  
  color: {({ theme }) => theme.text2};
  
  overflow: hidden;
  text-overflow: ellipsis;
  
  white-space: nowrap;
  
  padding-bottom: 1px
`

const TraitValue = styled.div`
  color: ${ ({theme}) => theme.primary2 });
  
  font-size: 15px;
  font-weight: 600;
  
  line-height: 30px;
  
  overflow: hidden;
  text-overflow: ellipsis;
  
  white-space: nowrap;
`

const ButtonCentering = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;

  gap: 10%;
`

const TransferButtonPosition = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const BuyColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: normal;

  margin: 30px;

  ${ ({theme}) => theme.mediaWidth.upToSmall`
    align-items: center;
  `};
`

const LinkWrap = styled.div`
  display: flex;
  align-content: center;
  
  text-overflow: ellipsis;
  overflow: hidden;
  
  white-space: nowrap;
  
  margin-bottom: 15px;
`

const LinkStyle = styled(Link)`
  font-size: 22px;
  font-weight: 600;

  color: ${ ({theme}) => theme.text2 };
  text-decoration: none;

  :hover {
    color: ${ ({theme}) => theme.white });
    text-decoration: underline;
  }
`

const IconWrap = styled.div`
  display: flex;

  svg {
    height: 25px;
    width: auto;
    margin: 0px;
    padding-left: 5px;
  }
`

const TitleWrap = styled.div`
  text-align: left;

  font-size: 40px;
  font-weight: 800;

  text-overflow: ellipsis;
  overflow: hidden;

  white-space: nowrap;

  margin-bottom: 15px;
`

const PriceWrap = styled.div`
  text-align: center;

  font-size: 37px;
  font-weight: 800;

  text-overflow: ellipsis;
  overflow: hidden;

  white-space: nowrap;

  margin-bottom: 15px;
`

export const GlowCard = styled.div`
  justify-content: center;
  align-self: center;

  text-align: center;
  text-overflow: ellipsis;

  padding: 30px;
  margin: ${ (props) => props.className === 'activity' ? '10px 0px 10px 0px' : '30px 0px 30px 0px' };

  border-radius: 3rem;
  box-shadow: .02rem 0.5rem 2rem ${ ({theme}) => theme.text2 };

  :hover {
    filter: drop-shadow(0 0 0.001px ${ ({theme}) => theme.primary2 });
  }

  width: ${ (props) => props.className === 'activity' ? '800px' : '' };

  max-width: ${ (props) => props.className === 'activity' ? '800px' : '310px' };
`

const EthLogo = styled.img`
  height: 32px;
  width: auto;
  padding-right: 20px;
`

const InfoBoxTitle = styled.div`
  text-align: center;
  text-overflow: ellipsis;

  font-size: 22px;
  font-weight: 700;

  overflow: hidden;
  white-space: nowrap;

  margin-bottom: 15px;
`


export default AssetDetails
