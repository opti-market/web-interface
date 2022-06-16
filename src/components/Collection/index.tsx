
/* External imports */
import React, {useState, useEffect, useLayoutEffect} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'
import usePrevious from '../../hooks/usePrevious'

/* Internal imports */
import Metrics from '../Metrics'
import MarketBox from '../MarketBox'
import {CenterSuspense} from '../Asset'
import InfiniteScroll from '../InfiniteScroll'
import CoreAppSuspense from '../Suspense/CoreAppSuspense'
import {
  findCollection,
  parseCollection,
  whitelist,
  WhitelistInterface,
  loadTokenObjsArray,
  fetchTokenPrice,
  tokenImageURL,
  fetchActiveListings,
  getTotalSupply
} from '../../utils/utils'
import {
  initLastID,
  crossCheckAndFilter,
  queryTokenListedsForCollection,
  queryTokenDelistedsForCollection,
  queryTokenPurchasedsForCollection
} from '../../utils/graphql/apolloClient'
import {fadfmeFromMultipleQueries} from '../../utils/graphql/fetchAllEventData'
import collectionsFilters from '../../utils/collectionsFilters.json'


const Collection = ({
  account,
  chainId,
  library,
  selector,
  setSelector,
  isNotOnOptimism,
  optipunksListings,
  loadingOptipunksListings
}: any) => {
  const {collectionSlug}: any = useParams()
  // Numbers
  const [sortByFilter, setSortByFilter] = useState<number>(0)
  const [randomTokenId, setRandomTokenId] = useState<number>(1)
  const [mintedTokensCount, setMintedTokensCount] = useState<number>(0)
  // Arrays
  const [loadAll, setLoadAll]: any = useState([])
  const [loadListed, setLoadListed]: any = useState([])
  const [loadAllObjs, setLoadAllObjs]: any = useState([])
  const [assetsByType, setAssetsByType]: any = useState([])
  const [loadFiltered, setLoadFiltered]: any = useState([])
  const [activeListings, setActiveListings]: any = useState([])
  const [loadListedObjs, setLoadListedObjs]: any = useState([])
  const [loadCollection, setLoadCollection]: any = useState([])
  const [typeFiltersData, setTypeFiltersData]: any = useState([])
  const [loadFilteredObjs, setLoadFilteredObjs]: any = useState([])
  // SortBy Options, default values
  const sortByOptionsArray = [
    {index: 0, description: "Price: Low to High", type: "price"},
    {index: 1, description: "Price: High to Low", type: "price"},
    {index: 2, description: "ID: Ascending", type: "id"},
    {index: 3, description: "ID: Descending", type: "id"},
    {index: 4, description: "Rarity: Ascending", type: "rarity"},
    {index: 5, description: "Rarity: Descending", type: "rarity"}
  ]
  const [sortByOptions, setSortByOptions]: any = useState(sortByOptionsArray)
  // Booleans
  const [isHidden, setIsHidden] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [noActiveListings, setNoActiveListings] = useState<boolean>(false)
  const [noListingsOfType, setNoListingsOfType] = useState<boolean>(false)
  // Filters and Sorting 
  const [apesFilter, setApesFilter] = useState<boolean>(false)
  const [typeFilters, setTypeFilters] = useState<boolean>(false)
  const [aliensFilter, setAliensFilter] = useState<boolean>(false)
  const [zombiesFilter, setZombiesFilter] = useState<boolean>(false)
  const [forSaleFilter, setForSaleFilter] = useState<boolean>(false)
  const [sortingLoaded, setSortingLoaded] = useState<boolean>(false)
  const [initialSortFilters, setInitialSortFilters] = useState<boolean>(true)
  const [
    activeListingsLoaded,
    setActiveListingsLoaded
  ] = useState<boolean>(false)
  const [
    typeFiltersInitialLoad,
    setTypeFiltersInitialLoad
  ] = useState<boolean>(true)


  // This sets the quantity of assets (max #) loaded per vertical scroll area 
  // (page). If a user scrolls past this many assets, another set of assets will
  // load.
  const ASSETS_PER_PAGE = 40
  const collection = findCollection(whitelist, collectionSlug)

  let hasMoreDataListed: boolean = false,
    hasMoreDataFilter: boolean = false

  if (
    loadListedObjs !== undefined &&
    activeListings !== undefined &&
    assetsByType !== undefined
  ) {
    hasMoreDataListed = loadListedObjs.length < activeListings.length
    hasMoreDataFilter = loadFilteredObjs.length < assetsByType.length
  }

  let collectionAddress = '',
    collection_ = parseCollection(collection) as WhitelistInterface,
    TITLE_IMG_SRC = tokenImageURL(randomTokenId, collection),
    mintedTokensCount_: number = collection.token_count_current,
    // Booleans to keep track of current tokenObjs displayed versus total count
    hasMoreDataAll = loadAllObjs.length < collection.token_count_current


  if (mintedTokensCount > mintedTokensCount_) mintedTokensCount_ = mintedTokensCount
  if (mintedTokensCount_ > collection.token_count_current)
    hasMoreDataAll = loadAllObjs.length < mintedTokensCount_

  if (chainId === 69) {
    collectionAddress = collection_.contractAddress__Kovan
  } else { // OptiMarket does not support any other chains
    collectionAddress = collection_.contractAddress__Mainnet
  }

  /***********************
   * Functional functions*
   **********************/
  // Load data when user scrolls past 40 NFTs. This sorts through either the 
  // full collection or the filtered ones.
  const loadMoreAssets = () => {
    let collection_ = parseCollection(collection) as WhitelistInterface,
      collections: any = [],
      currentTokenObjs: any = [],
      countToLoad: number = ASSETS_PER_PAGE

    // If no filter is selected, we load from the full list of assets' tokenObjs
    if ((!forSaleFilter && !typeFilters) && hasMoreDataAll) {
      let tokenIndex = 0

      setIsLoading(true)

      // If less than ASSETS_PER_PAGE tokens have been minted, only load that
      collection.token_count_current = mintedTokensCount_

      if (mintedTokensCount_ < ASSETS_PER_PAGE) {
        countToLoad = mintedTokensCount_ - loadAllObjs.length
      }

      // If the collections first token is 1, set that as the starting tokenId
      // index:
      if (!loadAll[0] && collection.first_token === 1) tokenIndex = 1

      if (loadAll[0]) {
        currentTokenObjs = loadAllObjs
        // Start with the next tokenId number
        tokenIndex = loadAllObjs.length + 1

        // If remainingTokenCount < ASSETS_PER_PAGE, only load the remaining 
        // number of assets 
        let remainingTokenCount = collection.token_count - loadAllObjs.length

        if (mintedTokensCount < collection.token_count)
          remainingTokenCount = mintedTokensCount - loadAllObjs.length
        if (remainingTokenCount < ASSETS_PER_PAGE)
          countToLoad = remainingTokenCount
      }


      const newSetOfTokenObjs: any = loadTokenObjsArray(tokenIndex, countToLoad)

      collection_.tokenObjs = [...currentTokenObjs, ...newSetOfTokenObjs]

      setLoadAllObjs(collection_.tokenObjs)

      collections.push(collection_)

      setLoadAll(collections)
      setLoadCollection(collections)
      setIsLoading(false)
    }


    // If a filter is selected, we load from the filtered assets' tokenObjs
    if (
      (forSaleFilter && !typeFilters && hasMoreDataListed) ||
      (typeFilters && hasMoreDataFilter)
    ) {
      let tokenObjsArray: any = [],
        newSetOfTokenObjs: any = [],
        tokenIndex = 0

      setIsLoading(true)

      // If typeFilter = true, load selected type filter token Objs, else load
      // activeListings
      if (!typeFilters) {
        tokenObjsArray = parseCollection(activeListings)
      } else if (typeFilters) {
        tokenObjsArray = parseCollection(assetsByType)
      }

      // If the number of tokenObjsArray is less than ASSETS_PER_PAGE 
      // (default=40), set the count of assets to load equal to that number
      if (tokenObjsArray.length < ASSETS_PER_PAGE)
        countToLoad = tokenObjsArray.length

      if (
        (loadListedObjs[0] && !typeFilters) ||
        (loadFilteredObjs[0] && typeFilters)
      ) {
        if (!typeFilters) {
          currentTokenObjs = loadListedObjs
        } else if (
          // We only load the previous typeFilters tokenObjs IF the 
          // assetsByType array is longer
          typeFilters && (tokenObjsArray.length > loadFilteredObjs.length)
        ) {
          currentTokenObjs = loadFilteredObjs
        }

        // Start with the next tokenId number
        tokenIndex = currentTokenObjs.length

        // If remainingTokenCount < ASSETS_PER_PAGE, only load the remaining 
        // number of assets 
        const remainingTokenCount =
          tokenObjsArray.length - currentTokenObjs.length

        if (remainingTokenCount < ASSETS_PER_PAGE) {
          countToLoad = remainingTokenCount
        }
      }

      for (let i = 0; i < countToLoad; i++) {
        const tokenObj = tokenObjsArray[tokenIndex]

        newSetOfTokenObjs.push(tokenObj)

        tokenIndex++
      }

      let updatedTokenObjs = [...currentTokenObjs, ...newSetOfTokenObjs]

      // Sort By the chosen sort filter, default is Price: Low to High
      collection_.tokenObjs = sortBy(updatedTokenObjs)

      collections.push(collection_)

      if (!typeFilters) {
        setLoadListedObjs(collection_.tokenObjs)
        setLoadListed(collections)
      } else {
        setLoadFilteredObjs(collection_.tokenObjs)
        setLoadFiltered(collections)
      }

      setLoadCollection(collections)
      setIsLoading(false)
    }
  }

  const handleSortFilter = (e) => {
    if (initialSortFilters) setInitialSortFilters(false)
    setSortByFilter(e.target.value)
  }

  const handleSortByOptions = (showingOnlyListed: boolean) => {
    let allSortOptions: any = [...sortByOptionsArray],
      updatedSortOptions: any

    // Note this is in reverse because this function is called before updating 
    // the forSaleFilter state
    if (showingOnlyListed && !typeFilters) {
      updatedSortOptions = allSortOptions.filter(
        option => option.type !== 'rarity'
      )
    } else {
      updatedSortOptions = allSortOptions
    }

    setSortByOptions(updatedSortOptions)
  }

  // Sort any array of token objects by price, tokenId, etc
  const sortBy = (objArray) => {
    let sortedArray: any = [...objArray]
    let isListedArray: any = [],
      isNotListedArray: any = []

    if (Number(sortByFilter) === 0 || Number(sortByFilter) === 1) {
      // If sorting by price, we move the listed tokens to the front
      if (typeFilters) for (let i = 0; i < sortedArray.length; i++) {
        const tokenObj = sortedArray[i]

        if (Number(parseFloat(tokenObj.price)) > 0) {
          isListedArray.push(tokenObj)
        } else {
          isNotListedArray.push(tokenObj)
        }
      } else if (!typeFilters) {
        isListedArray = sortedArray
      }

      // NOTE: Conditionals will fail if triple equals are used
      if (Number(sortByFilter) === 0) {
        isListedArray.sort(
          (a, b) => {
            const PRICE_A = Number(parseFloat(a.price))
            const PRICE_B = Number(parseFloat(b.price))

            return PRICE_A > PRICE_B ? 1 : -1
          }
        )
      } else if (Number(sortByFilter) === 1) {
        isListedArray.sort(
          (a, b) => {
            const PRICE_A = Number(parseFloat(a.price))
            const PRICE_B = Number(parseFloat(b.price))

            return PRICE_A < PRICE_B ? 1 : -1
          }
        )
      }

      sortedArray = isListedArray

      if (typeFilters) {
        isNotListedArray.map(tokenObj => sortedArray.push(tokenObj))
      }
    } else if (Number(sortByFilter) === 2) {
      sortedArray.sort(
        (a, b) => {
          const TOKENID_A = Number(parseFloat(a.tokenId))
          const TOKENID_B = Number(parseFloat(b.tokenId))

          return TOKENID_A > TOKENID_B ? 1 : -1
        }
      )
    } else if (Number(sortByFilter) === 3) {
      sortedArray.sort(
        (a, b) => {
          const TOKENID_A = Number(parseFloat(a.tokenId))
          const TOKENID_B = Number(parseFloat(b.tokenId))

          return TOKENID_A < TOKENID_B ? 1 : -1
        }
      )
    } else if (Number(sortByFilter) === 4) {
      sortedArray.sort(
        (a, b) => {
          const RARITY_A = Number(parseFloat(a.rarity))
          const RARITY_B = Number(parseFloat(b.rarity))

          return RARITY_A > RARITY_B ? 1 : -1
        }
      )
    } else if (Number(sortByFilter) === 5) {
      sortedArray.sort(
        (a, b) => {
          const RARITY_A = Number(parseFloat(a.rarity))
          const RARITY_B = Number(parseFloat(b.rarity))

          return RARITY_A < RARITY_B ? 1 : -1
        }
      )
    }

    return sortedArray
  }

  const previousSortByFilter = usePrevious(sortByFilter)

  // Sorts the currently displayed token objects when sortFilter is changed
  const sortCurrentTokenObjs = () => {
    let _collection = parseCollection(collection) as WhitelistInterface,
      collections: any = []

    if (forSaleFilter && !typeFilters && loadListed[0]) {
      let sortedTokenObjs = sortBy(loadListedObjs)

      _collection.tokenObjs = sortedTokenObjs
      collections.push(_collection)

      setLoadListedObjs(sortedTokenObjs)
      setLoadListed(collections)
      setLoadCollection(collections)
    } else if (typeFilters && loadFiltered[0]) {
      let sortedTokenObjs = sortBy(loadFilteredObjs)

      _collection.tokenObjs = sortedTokenObjs
      collections.push(_collection)

      setLoadFilteredObjs(sortedTokenObjs)
      setLoadFiltered(collections)
      setLoadCollection(collections)
    }
  }

  // Fetch collection's filters data from json
  const fetchTypeFiltersData = () => {
    const collectionData: any = collectionsFilters.find(
      collection => collection.slug == collectionSlug
    )

    if (!collectionData) { } else {
      let collectionFilters: any = [...collectionData.filters]

      for (let i = 0; i < collectionFilters.length; i++) {
        let typeFilterArray: any = Object.values(collectionFilters[i])[0],
          typeFilterName: string = Object.keys(collectionFilters[i])[0],
          tokenObjsWithPrices: any = []

        for (let j = 0; j < typeFilterArray.length; j++) {
          let tokenObj: any = {
            id: 0,
            tokenId: 0,
            price: 0,
            activeOffer: 0,
            rarity: 0
          }

          tokenObj.id = j
          tokenObj.tokenId = typeFilterArray[j].tokenId
          tokenObj.rarity = typeFilterArray[j].rarity

          fetchTokenPrice(
            collectionAddress,
            tokenObj.tokenId,
            account,
            chainId,
            library
          ).then(result => {
            tokenObj.price = result
          })

          tokenObjsWithPrices.push(tokenObj)
        }

        // Add tokenObjects with the proper format to a copy of collectionFilters
        collectionFilters[i][typeFilterName] = tokenObjsWithPrices
      }

      setTypeFiltersData(collectionFilters)
    }
  }

  const filterByListed = (tokenObjsArray: any) => {
    let listedTokenObjs: any = []

    listedTokenObjs = tokenObjsArray.filter(tokenObj => tokenObj.price > 0)

    if (listedTokenObjs.length === 0) {
      setNoListingsOfType(true)
    } else if (noListingsOfType) {
      // Reset the noListingsOfType boolean if necessary
      setNoListingsOfType(false)
    }

    return listedTokenObjs
  }

  // Fetch assets by type if filters are chosen
  const fetchAssetsByType = (type: string) => {
    const loadAliens = (type === 'Aliens')
    const loadApes = (type === 'Apes')
    const loadZombies = (type === 'Zombies')
    const loadForSale = (type === 'ForSale')

    // Reset the current loaded assets since assetsByType is changing
    setLoadFilteredObjs([])

    let tokenObjsArray: any = [],
      aliens: any = Object.values(typeFiltersData[0])[0],
      apes: any = Object.values(typeFiltersData[1])[0],
      zombies: any = Object.values(typeFiltersData[2])[0]

    // If filter=true && filter was not turned OFF ... or ...
    // if filter=false && filter was turned ON, then add token types
    if (
      (zombiesFilter && !loadZombies) ||
      (!zombiesFilter && loadZombies)
    ) {
      zombies.forEach(tokenObj => tokenObjsArray.push(tokenObj))
    }

    if (
      (apesFilter && !loadApes) ||
      (!apesFilter && loadApes)
    ) {
      apes.forEach(tokenObj => tokenObjsArray.push(tokenObj))
    }

    if (
      (aliensFilter && !loadAliens) ||
      (!aliensFilter && loadAliens)
    ) {
      aliens.forEach(tokenObj => tokenObjsArray.push(tokenObj))
    }

    if (
      (forSaleFilter && !loadForSale) ||
      (!forSaleFilter && loadForSale)
    ) {
      setAssetsByType(sortBy(filterByListed(tokenObjsArray)))
    } else {
      setAssetsByType(sortBy(tokenObjsArray))
    }
  }

  // Filter Button Handlers
  const handleForSaleFilter = () => {
    handleSortByOptions(!forSaleFilter)
    setForSaleFilter(!forSaleFilter)

    if (typeFilters) fetchAssetsByType('ForSale')
  }

  const [colorButton, setColorButton] = useState('transparent')
  const onClickFilter = () => {
    colorButton === 'transparent'
      ? setColorButton('#ff042025')
      : setColorButton('transparent')
  }

  const typeFilterButtons = [
    {index: 0, type: 'Aliens'},
    {index: 1, type: 'Apes'},
    {index: 2, type: 'Zombies'}
  ]

  const _onLoad = () => {
    setIsHidden(false)
  }

  const handleTypeFilters = (type: string) => {
    const loadAliens = (type === 'Aliens')
    const loadApes = (type === 'Apes')
    const loadZombies = (type === 'Zombies')

    handleSortByOptions(false)
    fetchAssetsByType(type)

    if (loadAliens) setAliensFilter(!aliensFilter)
    if (loadApes) setApesFilter(!apesFilter)
    if (loadZombies) setZombiesFilter(!zombiesFilter)

    // If you are turning off one specific type filter and no other type filters
    // are on, then typeFilters is set to false
    if (
      typeFilters && (
        ((loadAliens && aliensFilter) && !apesFilter && !zombiesFilter) ||
        ((loadApes && apesFilter) && !zombiesFilter && !aliensFilter) ||
        ((loadZombies && zombiesFilter) && !apesFilter && !aliensFilter)
      )
    ) {
      setTypeFilters(false)
    } else if (
      !typeFilters &&
      (loadAliens || loadApes || loadZombies)
    ) {
      setTypeFilters(true)
    }
  }

  // Featured token shuffler
  function getRandomTokenId() {
    let tokenIdUpperLimit: number = collection.token_count

    if (
      (mintedTokensCount_ < collection.token_count)
    ) {
      tokenIdUpperLimit = mintedTokensCount_
    }

    const randomTokenId_ = Math.floor(
      Math.random() * tokenIdUpperLimit +
      collection.first_token
    )

    setRandomTokenId(randomTokenId_)
  }

  /********************
   * useLayoutEffects *
   *******************/
  useEffect(() => {
    setSelector('Collection')

    const fetchActiveListings = fadfmeFromMultipleQueries(
      ['tokenListeds', 'tokenDelisteds', 'tokenPurchaseds'],
      [
        queryTokenListedsForCollection,
        queryTokenDelistedsForCollection,
        queryTokenPurchasedsForCollection
      ],
      initLastID,
      collectionAddress
    )

    Promise.all([
      fetchActiveListings
    ]).then(eventData => {
      let activeListings_ = crossCheckAndFilter(eventData)

      setActiveListingsLoaded(true)
      setActiveListings(activeListings_)

      if (activeListings_ !== undefined) {
        if (activeListings_[0].length === 0) setNoActiveListings(true)
      }
    })

    if (!typeFiltersData[0]) fetchTypeFiltersData()

    getTotalSupply(collection, 10).then(response => {
      setMintedTokensCount(response)
      mintedTokensCount_ = response
      getRandomTokenId()
    })


  }, [collectionSlug, chainId, optipunksListings])


  useLayoutEffect(() => {
    if (!forSaleFilter && !typeFilters) {
      setLoadCollection(loadAll)
    } else if (forSaleFilter && !typeFilters) {
      setLoadCollection(loadListed)
    } else if (typeFilters) {
      setLoadCollection(loadFiltered)
    }
  }, [forSaleFilter, typeFilters])

  useLayoutEffect(() => {
    if (typeFilters && typeFiltersInitialLoad) {
      loadMoreAssets()
      setTypeFiltersInitialLoad(false)
    }
    if (!typeFilters && !typeFiltersInitialLoad) {
      // Reset the initial load if type filters are turned off
      setTypeFiltersInitialLoad(true)
      setLoadFiltered([])
    }
  }, [typeFilters, typeFiltersInitialLoad])

  useLayoutEffect(() => {
    if (
      (typeFilters && loadFiltered[0]) ||
      (typeFilters && noListingsOfType)
    ) {
      // Reset the noListingsOfType boolean if necessary
      if (!forSaleFilter && noListingsOfType) {
        setNoListingsOfType(false)
      }

      setLoadFiltered([])

      // Since the assetsByType array is reset, we should reset 
      // hasMoreDataFilter hasMoreDataFilter = true
      loadMoreAssets()
    }
  }, [assetsByType, forSaleFilter])


  /**************
   * useEffects *
   *************/
  useEffect(() => {
    if (
      chainId && !initialSortFilters &&
      (previousSortByFilter !== sortByFilter) &&
      (forSaleFilter || typeFilters)
    ) {
      setIsLoading(true) // setter

      sortCurrentTokenObjs()

      setSortingLoaded(true) // setter
    }
  }, [sortByFilter])

  // This useEffect is fired after the above useEffect sets `sortingLoaded` to
  // `true`.
  useEffect(() => {
    if (chainId && sortingLoaded) {
      setIsLoading(false)
      setSortingLoaded(false)
    }
  }, [isLoading, sortingLoaded])


  return (
    <>
      <TitleImgWrap>
        {isHidden ? (
          <>
            <CenterSuspense>
              {/* <Spinner /> */}
              <CoreAppSuspense />
            </CenterSuspense>
          </>
        ) : (
          <></>
        )}
        <TitleImg src={TITLE_IMG_SRC} onLoad={_onLoad} hidden={isHidden} />
      </TitleImgWrap>
      <Title>{collection.name}</Title>
      <Description>{collection.description}</Description>
      <Metrics collection={collection} />
      <FilterDiv>

        {forSaleFilter || typeFilters ? (
          <>
            <SortWrap>
              <SortDesc>Sort By</SortDesc>
              <SortSelect
                id="sortBySelector"
                value={sortByFilter}
                onChange={(e: any) => {
                  handleSortFilter(e)
                }}
              >
                {sortByOptions.map(option => {
                  return (
                    <option key={option.index}
                      value={option.index}>{option.description}
                    </option>
                  )
                })}
              </SortSelect>
            </SortWrap>
          </>
        ) : (
          <></>
        )}

        <TitleFilters>Filters</TitleFilters>

        {activeListingsLoaded ? (
          <>
            {!forSaleFilter ? (
              <FilterButton color={colorButton} onClick={() => {
                handleForSaleFilter();
                onClickFilter();
              }} >
                For Sale
              </FilterButton>
            ) : (
              <FilterButtonActive color={colorButton} onClick={() => {
                handleForSaleFilter();
                onClickFilter();
              }} >
                For Sale
              </FilterButtonActive>
            )}
          </>
        ) : (
          <FilterButtonLoading>
            Loading ...
          </FilterButtonLoading>
        )}


        {collectionSlug === 'optipunks' ? (
          <>
            {/* {typeFilterButtons.map(filter => {
              return (
                <FilterButton color={colorButton} onClick={() => {
                  handleTypeFilters(filter.type);
                  onClickFilter();
                }}>
                  {filter.type}
                </FilterButton>
              )
            })} */}
            {!aliensFilter ? (
              <FilterButton
                color={colorButton}
                onClick={() => {
                  handleTypeFilters(typeFilterButtons[0].type)
                  onClickFilter()
                }}
              >
                {typeFilterButtons[0].type}
              </FilterButton>
            ) : (
              <FilterButtonActive
                color={colorButton}
                onClick={() => {
                  handleTypeFilters(typeFilterButtons[0].type)
                  onClickFilter()
                }}
              >
                {typeFilterButtons[0].type}
              </FilterButtonActive>
            )}
            {!apesFilter ? (
              <FilterButton
                color={colorButton}
                onClick={() => {
                  handleTypeFilters(typeFilterButtons[1].type)
                  onClickFilter()
                }}
              >
                {typeFilterButtons[1].type}
              </FilterButton>
            ) : (
              <FilterButtonActive
                color={colorButton}
                onClick={() => {
                  handleTypeFilters(typeFilterButtons[1].type);
                  onClickFilter();
                }}
              >
                {typeFilterButtons[1].type}
              </FilterButtonActive>
            )}
            {!zombiesFilter ? (
              <FilterButton
                color={colorButton}
                onClick={() => {
                  handleTypeFilters(typeFilterButtons[2].type);
                  onClickFilter();
                }}
              >
                {typeFilterButtons[2].type}
              </FilterButton>
            ) : (
              <FilterButtonActive
                color={colorButton}
                onClick={() => {
                  handleTypeFilters(typeFilterButtons[2].type);
                  onClickFilter();
                }}
              >
                {typeFilterButtons[2].type}
              </FilterButtonActive>
            )}
          </>
        ) : (
          <></>
        )}
      </FilterDiv>

      {(noActiveListings && forSaleFilter) ||
        (noListingsOfType && typeFilters) ? (
        <>
          {noActiveListings && forSaleFilter ? (
            <>
              <h2>
                No items in this collection are currently listed for sale.
              </h2>
            </>
          ) : (
            <>
              <h2>No items for the selected types are listed for sale.</h2>
            </>
          )}
        </>
      ) : (
        <>
          <InfiniteScroll
            hasMoreDataAll={hasMoreDataAll}
            hasMoreDataListed={hasMoreDataListed}
            hasMoreDataFilter={hasMoreDataFilter}
            isLoading={isLoading}
            onBottomHit={loadMoreAssets}
            loadOnMount={true}
            forSaleFilter={forSaleFilter}
            typeFilters={typeFilters}
            loadListedObjs={loadListedObjs}
            loadFilteredObjs={loadFilteredObjs}
            assetsByType={assetsByType}
          >
            <MarketBox
              selector={selector}
              userCollections={[]}
              homeCollections={[]}
              loadCollection={loadCollection}
              isLoading={isLoading}
            />
          </InfiniteScroll>
        </>
      )}
    </>
  )
}


const TitleImgWrap = styled.div`
  display: flex;
  height: 130px;
  width: 130px;
  align-items: center;
  justify-content: center;
  ${ ({theme}) => theme.mediaWidth.upToSmall`
    top: 20px;
  `};
`

const TitleImg = styled.img`
  height: 130px;
  width: auto;
  border-radius: 50%;
`

const Title = styled.h1`
  margin-bottom: 15px;
`

const Description = styled.div`
  display: flex;
  text-align: center;
  color: ${ ({theme}) => theme.primary2 };
`

const FilterDiv = styled(Description)`
  font-size: 13.5px;
  margin: 20px 0px 25px 0px;
  ${ ({theme}) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`

const TitleFilters = styled.h2`
  margin: auto;
`

const FilterButton = styled.button`
  justify-content: space-around;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: ${ ({theme}) => theme.text2 };
  
  background-color: transparent;
  margin: auto 17px auto 17px;
  padding: 15px 15px;
  max-height: 50px;
  max-width: 150px;
  border: 1px solid ${ ({theme}) => theme.text2 };
  border-radius: 3rem;
  :hover {
    opacity: 0.85;
    filter: drop-shadow(0 0 0.8rem ${ ({theme}) => theme.text2 });
  }
  :active {
    transform: scale(0.97);
  }
  ${ ({theme}) => theme.mediaWidth.upToSmall`
    margin: 10px;
`};
`

const FilterButtonActive = styled.button`
  justify-content: space-around;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: ${ ({theme}) => theme.text2 };
  
  background-color: #ff042050;
  margin: auto 17px auto 17px;
  padding: 15px 15px;
  max-height: 50px;
  max-width: 150px;
  border: 1px solid ${ ({theme}) => theme.text2 };
  border-radius: 3rem;
  :hover {
    opacity: 0.85;
    filter: drop-shadow(0 0 0.8rem ${ ({theme}) => theme.text2 });
  }
  :active {
    transform: scale(0.97);
  }
  ${ ({theme}) => theme.mediaWidth.upToSmall`
    margin: 10px;
`};
`
const FilterButtonLoading = styled(FilterButton)`
background-color: #9b9b9b
font-size: 13px;
`

const SortWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  margin: 15px 0px 15px 0px;
`

const SortDesc = styled.h2`
  margin-right: 15px;
`

const SortSelect = styled.select`
  align-self: center;
  padding: 5px;
  max-width: 200px;
  margin-right: 15px;
  border-style: solid;
  border-width: 1px;
  border-color: none;
  border-radius: 4rem;
  color: ${ ({theme}) => theme.text2 };
  background-color: ${ ({theme}) => theme.bg1 };
  text-overflow: ellipsis;
  text-align: center;
  font-size: 18px;
  filter: drop-shadow(0 0.01rem 0.12rem ${ ({theme}) => theme.text2 });
  :focus {
    outline: none;
    filter: drop-shadow(0 0.01rem 0.2rem ${ ({theme}) => theme.text2 });
  }
`


export default Collection