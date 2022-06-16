/* External imports */
import {ethers} from 'ethers'
import styled from 'styled-components'

/* Internal imports */
import Asset from '../Asset'
import Spinner from '../Suspense/Spinner'
import {parseCollection} from '../../utils/utils'


const MarketGrid = ({
  selector,
  isLoading,
  userCollections,
  homeCollections,
  loadCollection
}: any) => {
  let collections: any = []

  if (selector === 'Home') collections = parseCollection(homeCollections)
  if (selector === 'Profile') collections = parseCollection(userCollections)
  if (selector === 'Collection') collections = parseCollection(loadCollection)

  return (
    <>
      <AssetsFrame>
        {isLoading ? (
          <>
            <Spinner />
          </>
        ) : (
          <>
            {collections ? (
              <>
                {collections.map((collection: any) => (
                  collection.tokenObjs.map((tokenObj: any) => (
                    <>
                      <Asset
                        key={`${ collection.slug }${ tokenObj.tokenId ?? tokenObj._tokenId }`}
                        tokenId={tokenObj.tokenId ?? tokenObj._tokenId}
                        price={tokenObj.price ?? ethers.utils.formatEther(tokenObj._price)}
                        activeOffer={tokenObj.activeOffer ?? '0'}
                        rarity={tokenObj.rarity ?? '0'}
                        collection={collection}
                      />
                    </>
                  ))
                ))}
              </>
            ) : (
              <>
              </>
            )}
          </>
        )}
      </AssetsFrame>
    </>
  )
}


const AssetsFrame = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: space-evenly;
  
  margin: auto;
`


export default MarketGrid
