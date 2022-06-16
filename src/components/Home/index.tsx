
/* External imports */
import React, {memo, useEffect, useLayoutEffect, useMemo, useState} from 'react'
import styled from 'styled-components'

/* Internal imports */
import MarketBox from '../MarketBox'
import NetworkWarning from '../NetworkWarning'
import {
  parseCollection,
  whitelist,
  WhitelistInterface,
  loadTokenObjsArray,
  fetchActiveListings
} from '../../utils/utils'


const Home = ({
  account,
  chainId,
  selector,
  setSelector,
  optipunksListings,
  setOptipunksListings,
  setLoadingOptipunksListings
}: any) => {
  const [loadHome, setLoadHome] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [homeCollections, setHomeCollections]: any[] = useState([])
  const [
    activeListingsLoaded,
    setActiveListingsLoaded
  ] = useState<boolean>(false)

  function getRandomTokenId(collection, countToLoad) {
    let tokenIdUpperLimit: number = collection.token_count
    if (collection.token_count_current && (collection.token_count_current < collection.token_count))
      tokenIdUpperLimit = collection.token_count_current

    const randomTokenId_ = Math.floor(
      Math.random() * (tokenIdUpperLimit - countToLoad) +
      collection.first_token
    )

    return randomTokenId_
  }

  function fetchHomeCollections() {
    let homeCollections: any = []

    /**
     * @todo Change this to display a different number of tokens per whitelist 
     *       collection.
     */
    const countToLoad = 3

    setIsLoading(true)

    /**
     * @todo Currently we are using all whitelist collections to display on the
     *       homepage.
     */
    for (let i = 0; i < whitelist.length; i++) {
      // Sets the collection object
      let collection = parseCollection(whitelist[i]) as WhitelistInterface,
        tokenIndex = 0

      // If the collections first token is 1, set that as the starting tokenId index:
      if (collection.first_token == 1) tokenIndex = 1

      let randomIndex = getRandomTokenId(collection, countToLoad) + tokenIndex
      if (randomIndex === undefined || randomIndex == null) randomIndex = tokenIndex

      const setOfTokenObjs: any = loadTokenObjsArray(randomIndex, countToLoad)

      // Adds the associated list of tokenObjs to a collection object
      collection.tokenObjs = [...setOfTokenObjs]
      // Adds the (collection object + tokenObjs) to a collections array
      homeCollections.push(collection)
    }

    setHomeCollections(homeCollections)
    setIsLoading(false)

    return homeCollections
  }

  useEffect(() => {
    setSelector('Home')

    if (!loadHome) {
      fetchHomeCollections()
      setLoadHome(true)
    }
  }, [isLoading, loadHome])

  const sortBy = (array: any) => {
    let sortListings: any = array.sort(
      (a, b) => {
        const PRICE_A = Number(parseFloat(a.price))
        const PRICE_B = Number(parseFloat(b.price))

        return PRICE_A > PRICE_B ? 1 : -1
      })

    return sortListings
  }

  useEffect(() => {
    if (chainId && !optipunksListings[0]) {
      // pre-load optipunks listings that are for sale
      let collection_: any = parseCollection(whitelist[0]),
        collectionAddress = ''

      if (chainId === 69) collectionAddress = collection_.contractAddress__Kovan
      else collectionAddress = collection_.contractAddress__Mainnet

      setLoadingOptipunksListings(true)
      fetchActiveListings(collectionAddress, chainId, sortBy)
        .then(activeListings_ => {
          if (activeListings_) setOptipunksListings(activeListings_)
          else console.log("No Listings ::", activeListings_)
          setLoadingOptipunksListings(false)
        })

      setActiveListingsLoaded(true)
    }
  }, [chainId])


  return (
    <>
      <HomeWrap>
        <h1>OptiMarket</h1>
        <Description>
          Your community marketplace for crypto collectibles and
          non-fungible tokens (NFTs) on Optimism.
        </Description>
      </HomeWrap>
      <MarketBox
        isLoading={isLoading}
        selector={selector}
        userCollections={[]}
        homeCollections={homeCollections}
        loadCollection={[]}
      />
    </>
  )
}

const HomeWrap = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`

const Description = styled.div`
  font-size: 25px;
  margin-bottom: 24px;
  margin-left: 8%;
  margin-right: 8%;
  color: ${ ({theme}) => theme.primary2 };
`


export default Home