/* External imports */
import React, {Suspense, useState, useLayoutEffect, useEffect, memo} from 'react'
import styled from 'styled-components'
import {Routes, Route, useLocation} from 'react-router-dom'
import {Contract} from '@ethersproject/contracts'

/* Internal imports */
import Faq from './components/Faq'
import Home from './components/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Profile from './components/Profile'
import Collection from './components/Collection'
import AssetDetails from './components/AssetDetails'
import Web3ReactManager from './components/Web3ReactManager'
import CollectionOverview from './components/CollectionOverview'
import CoreAppSuspense from './components/Suspense/CoreAppSuspense'
import getContracts from './lib/ethers/getContracts'
import {useActiveWeb3React} from './hooks'
import {
  whitelist, WhitelistInterface, Web3Interface,
  fetchTokenPrice, fetchTokenOfferStatus
} from './utils/utils'


const App = ({ }: any) => {
  const {account, chainId, library} = useActiveWeb3React() as Web3Interface
  const [selector, setSelector]: any = useState('')
  const [selectedAddy, setSelectedAddy] = useState<string>('')
  const [contracts, setContracts] = useState<Contract[]>([])
  const [userCollections, setUserCollections] = useState([])
  const [isNotOnOptimism, setIsNotOnOptimism] = useState<boolean>(false)
  const [noTokensPresent, setNoTokensPresent] = useState<boolean>(false)

  const [optipunksListings, setOptipunksListings]: any = useState([])
  const [loadingOptipunksListings, setLoadingOptipunksListings] = useState<boolean>(false)

  const location = useLocation()

  const initialize = (userAddy) => {
    setSelectedAddy(userAddy)
  }

  /**
   * @dev Fetches collections that a user owns based on whitelisted contracts.
   * @returns {Promise<any>} collections: Collections that a user owns.
   */
  async function fetchUserAssets(): Promise<any> {
    let collections: any = []

    // If the wallet is connected, then initialize the account!
    if (account && selectedAddy !== account.toString()) initialize(account)
    if (contracts.length < 1) getContracts(chainId, library, setContracts)

    if (contracts) {
      for (let i = 0; i < contracts.length; i++) {
        let tokenBalance: any = 0

        tokenBalance = (await contracts[i].balanceOf(selectedAddy)).toNumber()

        let collection = whitelist[i] as WhitelistInterface,
          collectibleUpdate: any = [],
          tokenId: any,
          collectionAddress = '';

        for (let j = 0; j < tokenBalance; j++) {
          if (tokenBalance === 0) setNoTokensPresent(true)
          let tokenObj: any = {id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}

          tokenObj.id = j
          tokenId = await contracts[i].tokenOfOwnerByIndex(selectedAddy, j)
          tokenObj.tokenId = tokenId.toNumber()

          if (chainId === 69) collectionAddress = collection.contractAddress__Kovan
          if (chainId === 10) collectionAddress = collection.contractAddress__Mainnet

          fetchTokenPrice(collectionAddress, tokenObj.tokenId,
            account, chainId, library).then(result => {
              tokenObj.price = result
            })

          fetchTokenOfferStatus(collectionAddress, tokenObj.tokenId,
            account, chainId, library).then(result => {
              tokenObj.activeOffer = result
            })

          collectibleUpdate.push(tokenObj)
        }

        collection.tokenObjs = collectibleUpdate
        collections.push(collection)
      }
    } else { }

    setUserCollections(collections)

    return collections
  }

  function checkIsNotOnOptimism() {
    if ((chainId === 69) || (chainId === 10)) {
      setIsNotOnOptimism(false)
    } else {
      setIsNotOnOptimism(true)
    }
  }

  useEffect(() => {
    if (account) checkIsNotOnOptimism()
  }, [account, chainId])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location, account, chainId, library])


  return (
    <Suspense fallback={<CoreAppSuspense />}>
      <Web3ReactManager>
        <AppWrapper>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            <Routes>
              <Route
                path='/'
                element={
                  <Home
                    account={account}
                    chainId={chainId}
                    selector={selector}
                    setSelector={setSelector}
                    optipunksListings={optipunksListings}
                    setOptipunksListings={setOptipunksListings}
                    setLoadingOptipunksListings={setLoadingOptipunksListings}
                  />}
              />
              <Route
                path='/Profile'
                element={
                  <Profile
                    account={account}
                    chainId={chainId}
                    library={library}
                    userCollections={userCollections}
                    noTokensPresent={noTokensPresent}
                    selector={selector}
                    setSelector={setSelector}
                    fetchUserAssets={fetchUserAssets}
                    checkIsNotOnOptimism={checkIsNotOnOptimism}
                    isNotOnOptimism={isNotOnOptimism}
                  />
                }
              />
              <Route
                path='/collection/:collectionSlug'
                element={
                  <Collection
                    selector={selector}
                    setSelector={setSelector}
                    account={account}
                    chainId={chainId}
                    library={library}
                    checkIsNotOnOptimism={checkIsNotOnOptimism}
                    isNotOnOptimism={isNotOnOptimism}
                    optipunksListings={optipunksListings}
                    loadingOptipunksListings={loadingOptipunksListings}
                  />
                }
              />
              <Route
                path='/AssetDetails/:collectionSlug/:tokenId'
                element={
                  <AssetDetails
                    account={account}
                    chainId={chainId}
                    library={library}
                    checkIsNotOnOptimism={checkIsNotOnOptimism}
                    isNotOnOptimism={isNotOnOptimism}
                  />
                }
              />
              <Route
                path='/Faq'
                element={<Faq />}
              />
              <Route
                path='/Collections'
                element={<CollectionOverview />}
              />
            </Routes>
          </BodyWrapper>
          <Footer />
        </AppWrapper>
      </Web3ReactManager>
    </Suspense>
  )
}


const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${ ({theme}) => theme.flexRowNoWrap }
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  padding-top: 70px;
  
  width: 100%;
  
  overflow-y: auto;
  overflow-x: hidden;
  
  z-index: 1;
`


export default App