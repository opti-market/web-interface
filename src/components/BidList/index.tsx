/* External imports */
import React, {
  useState,
  useLayoutEffect,
  useEffect
} from 'react'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'

/* Internal imports */
import Offer from './Offer'
import Tooltip from '../Tooltip'
import { getOffers } from '../../lib/contract-apis/marketplace'
import { getETHPriceInUSD } from '../../lib/ethers/getETHPrices'
import { OfferStructOutput } from '../../lib/contract-apis/types/Marketplace'
import EthereumLogo from '../../assets/images/ethereum-logo.svg'
import { useIsDarkMode } from '../../state/user/hooks'
import QuestionMarkGold from '../../assets/images/question_mark_gold.png'
import QuestionMarkBlack from '../../assets/images/question_mark_black.png'


// Giving arguments of `any` allows us to subtract dates
export function findDateTimeDiff(date1: any, date2: any) {
  const dayDiff = Math.abs(date2 - date1) / (1000 * 60 * 60 * 24),
    dayFloor = Math.floor(dayDiff),
    hourDiff = (dayDiff - dayFloor) * 24,
    hourFloor = Math.floor(hourDiff),
    minDiff = (hourDiff - hourFloor) * 60,
    minFloor = Math.floor(minDiff)

  let dayResult: string = '',
    hourResult: string = ''

  if (dayFloor.toString() !== '0') dayResult = `${ dayFloor.toString() } days, `
  if (hourFloor.toString() !== '0') hourResult = `${ hourFloor.toString() } hrs, `

  let minResult = `${ minFloor.toString() } min`

  const dateTimeDiff = `${ dayResult }${ hourResult }${ minResult }`

  return dateTimeDiff
}

export function dropDanglingChar(tooltipTime: string) {
  const charIndex = tooltipTime.indexOf('s')

  if (charIndex > 0) {
    const truncatedLeft = tooltipTime.substring(0, charIndex)
    const truncatedRight = tooltipTime.substring(charIndex + 1)
    const withoutDangling = truncatedLeft + truncatedRight

    return withoutDangling
  } else {
    return tooltipTime
  }
}

export function substrEndIndex(endIndex: number, tooltipTime: string) {
  return endIndex > 0 ? endIndex : tooltipTime.length
}


const BidList = ({
  tokenId,
  account,
  chainId,
  chainIdToLoad,
  library,
  collection,
  tokenOwner,
  getIsTokenOwner,
  assetListed,
  getIsListed,
  bidTxConfirmed,
  userHasActiveBid,
  collectionAddress,
  setUserHasActiveBid,
}: any) => {
  const darkMode = useIsDarkMode();
  const [offers, setOffers] = useState<any>([])
  const [formattedOffers, setFormattedOffers] = useState<any>([])
  const [gotAllOffers, setGotAllOffers] = useState<boolean>(false)
  const [loadedTableData, setLoadedTableData] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [bidder, setBidder] = useState<boolean>(false)
  const [updateOffers, setUpdateOffers] = useState<boolean>(false)

  // State vars to pass to `Offer.tsx`
  const [ethPriceInUSD, setETHPriceInUSD] = useState<any>(0)

  const dateTimeLocal = new Date()

  let tokenIdBN: BigNumber = ethers.BigNumber.from(tokenId),
    getOffers_: OfferStructOutput[],
    buyer: string = ''

  // let chainIdToLoad = chainId
  // /** @dev This conditional sets the default chainId = 10 **/
  // if (chainId !== 69 || chainId !== 10) chainIdToLoad = 10

  // if (chainIdToLoad === 69) collectionAddress = collection.contractAddress__Kovan
  // if (chainIdToLoad === 10) collectionAddress = collection.contractAddress__Mainnet


  const fetchOffers = async () => {
    if (
      collection === undefined ||
      tokenId === undefined
    ) return Error(
      'Collection or tokenId is `undefined`!'
    )
    // If no wallet is connected, set account to blank
    if (account === undefined || account == null) account = "";

    getOffers_ = await getOffers(
      collectionAddress,
      tokenIdBN,
      account,
      chainIdToLoad
    ) as OfferStructOutput[]

    if (getOffers_.length > 0 && getOffers_[0][0]) {
      setOffers(getOffers_)
      setGotAllOffers(true)

      getOffers_.forEach((offer_: any) => {
        // buyer = offer_[4]
        // If any of the user has any active bids, set `userHasActiveBid` to true. 
        // This will switch between using `escrowedBid` versus changeBid in <Bid>
        if (offer_[4] === account) {
          setUserHasActiveBid(true)
          setBidder(true)
        }
      })
    }
  }

  const prepareBidTable = () => {
    const formatedOffers_: any = []
    // if(!isLoading) setIsLoading(true)

    offers.forEach((offer_: any) => {
      /**
       * @dev offer[0] == price: BigNumber
       *      offer[1] == timestamp: BigNumber
       *      offer[2] == expiration: BigNumber
       *      offer[3] == accepted: boolean
       *      offer[4] == buyer: string
       */
      let offer = [...offer_],
        price: BigNumber = offer[0],
        priceInETH = ethers.utils.formatEther(price),
        timestamp = offer[1], /** @todo This var isn't used!!!!  */
        expiration = offer[2]

      // If an offer's price is 0, that will be removed from the offers list
      if (price.isZero()) return []

      let dateTimeExpiry = new Date(expiration.toNumber() * 1000),
        expiryTimeRemaining = dateTimeExpiry.getTime() - dateTimeLocal.getTime()

      // If an offer is expired, that will be removed from the offers list
      if (expiryTimeRemaining < 0) return []

      offer.push(priceInETH.toString() + ' ')

      let tooltipTime = findDateTimeDiff(dateTimeExpiry, dateTimeLocal),
        commaIndex = tooltipTime.indexOf(','),
        // `truncTime` is short for `truncatedTime`
        truncTime = tooltipTime.substring(0, substrEndIndex(commaIndex, tooltipTime)),
        numsOnly = parseInt(truncTime.replace(/\D/g, ''))

      if ((numsOnly >= 1) && (truncTime.indexOf('s') >= 1)) {
        tooltipTime = 'in ' + tooltipTime
        truncTime = `in ${ truncTime }`
      } else {
        tooltipTime = dropDanglingChar(tooltipTime)
        truncTime.substring(0, truncTime.indexOf('s')) !== ''
          ? truncTime = truncTime.substring(0, truncTime.indexOf('s'))
          : truncTime = truncTime
      }

      offer.push(tooltipTime)
      offer.push(truncTime)
      formatedOffers_.push(offer)
    })
    // Sort formatted offers by price (offer[0]), High to Low
    formatedOffers_.sort((offerA, offerB) =>
      Number(parseFloat(offerA[5])) < Number(parseFloat(offerB[5])) ? 1 : -1)

    setFormattedOffers(formatedOffers_)
    setLoadedTableData(true)
  }

  const handleReloadOffers = () => {
    setIsLoading(true)
    getIsTokenOwner()
    getIsListed()
    setOffers([])
    setUserHasActiveBid(false)
    setBidder(false)
    setUpdateOffers(true)
    // window.location.reload()
  }

  /********************
   * useLayoutEffects *
   *******************/
  useEffect(() => {
    if (chainId) {
      setGotAllOffers(false)
      fetchOffers()
    }

    if (ethPriceInUSD === 0 || updateOffers) getETHPriceInUSD()
      .then((ethPriceInUSD_: any) => {
        if (ethPriceInUSD_ !== undefined && ethPriceInUSD_.USD !== undefined) {
          setETHPriceInUSD(ethPriceInUSD_.USD)
        }
      })
    if (updateOffers) setUpdateOffers(false)
  }, [account, chainId, assetListed, tokenId, collection, updateOffers])

  useLayoutEffect(() => {
    if (gotAllOffers && offers.length > 0) {
      prepareBidTable()
    }
  }, [account, chainId, assetListed, gotAllOffers])

  useLayoutEffect(() => {
    if (loadedTableData && (ethPriceInUSD !== 0)) {
      setIsLoading(false)
    }
  }, [account, chainId, loadedTableData, ethPriceInUSD, isLoading])

  useEffect(() => {
    if (account && bidTxConfirmed) handleReloadOffers()
  }, [bidTxConfirmed])

  return (
    <>
      { !isLoading && formattedOffers.length > 0 ? (
        <>
          <InfoBox>
            <BidTableTitle>Offers</BidTableTitle>
            <TableWrapper>
              <TableHeaderCentering>
                <TableHeader>Expiration</TableHeader>
                <TableHeader>Bid Price (WETH)</TableHeader>
                { tokenOwner || bidder ? (
                  <>
                    <TableHeader>Status</TableHeader>
                  </>
                ) : (
                  <>
                  </>
                ) }
              </TableHeaderCentering>
              <TableColumnCentering>
                <TableColumn>
                  { loadedTableData && formattedOffers.map(
                    (offer_: any) => (
                      <>
                        <TableCell key={ `${ offer_[4] }_time` } >
                          <TableText>{ offer_[7] }</TableText>
                          <Tooltip
                            content1={ offer_[6] }
                            role='text'
                            aria-label='Duration until bid expires'
                          >
                            <img
                              src={ darkMode ? QuestionMarkGold : QuestionMarkBlack }
                              alt='question-mark'
                              width='auto'
                              height='13.5px'
                            />
                          </Tooltip>
                        </TableCell>
                      </>
                    )
                  ) }
                </TableColumn>
                <TableColumn>
                  { loadedTableData && formattedOffers.map(
                    (offer_: any) => (
                      <TableCell key={ `${ offer_[4] }_price` }>
                        <ETHLogo src={ EthereumLogo } alt={ "(ETH)" } />
                        { '  ' } { offer_[5] }
                        <ETHPrice>
                          { `($${ (ethPriceInUSD * offer_[5]).toFixed(2) })` }
                        </ETHPrice>
                      </TableCell>
                    )
                  ) }
                </TableColumn>
                { (tokenOwner || bidder) && (chainId === 10 || chainId === 69) ? (
                  <>
                    <TableColumn>
                      { loadedTableData && formattedOffers.map((offer_: any) => (
                        <>
                          <Offer
                            key={ `${ offer_[4] }_offer` }
                            offer={ offer_ }
                            buyer={ offer_[4] }
                            price={ offer_[0] }
                            tokenId={ tokenId }
                            account={ account }
                            chainId={ chainId }
                            chainIdToLoad={ chainIdToLoad }
                            library={ library }
                            tokenOwner={ tokenOwner }
                            bidder={ bidder }
                            collectionAddress={ collectionAddress }
                            handleReloadOffers={ handleReloadOffers }
                          />
                        </>
                      )
                      ) }
                    </TableColumn>
                  </>
                ) : (
                  <>
                  </>
                ) }
              </TableColumnCentering>
            </TableWrapper>
          </InfoBox>
        </>
      ) : (
        <>
        </>
      ) }
    </>
  )
}



const BidTableTitle = styled.h1`
  margin-top: -5px;
  text-align: center;
  color: ${ ({ theme }) => theme.text2 };
`

const InfoBox = styled.div`
  font-size: 20px;
  font-weight: 700;

  padding: 30px;
  margin: 30px 0px 80px 0px;

  border-radius: 3rem;

  box-shadow: .02rem 0.5rem 2rem ${ ({ theme }) => theme.text2 };

  :hover {
    filter: drop-shadow(0 0 0.1px ${ ({ theme }) => theme.primary2 });
  }
`

const TableWrapper = styled.div`
  justify-content: space-around;

  margin-bottom: 50px;
  
  width: auto;
  max-width: 650px;

  text-align: center;

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    width: auto;
    max-width: 320px;
  `};

  border-width: 0rem;
  border-radius: 0rem;
  border-style: outset;
  border-color: ${ ({ theme }) => theme.text2 };

  font-size: 18px;
  font-weight: 600;
`

const TableHeaderCentering = styled.div`
  display: flex;
  flex-direction: row;
`

const TableHeader = styled.div`
  color: ${ ({ theme }) => theme.text2 };
  
  font-size: 18px;
  font-weight: 600;
  
  padding: 10px;
  
  width: 250px;
  max-width: 250px;

  border-bottom: 1px dashed ${ ({ theme }) => theme.primary2 };
`

const TableColumnCentering = styled.div`
  display: flex;
  flex-direction: row;
`

const TableColumn = styled.div`
  align-items: center;
  width: 250px;
  max-width: 250px;
`

const TableCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding-left: 14px;
  padding-right: 14px;
  height: 50px;
`

const TableText = styled.div`
  padding-right: 10px;
`

const ETHLogo = styled.img`
  height: 16px;
  margin-right: 10px;
  width: auto;
`

const ETHPrice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-left: 11px;

  font-size: 12.5px;
  font-weight: 500;
`


export default BidList
