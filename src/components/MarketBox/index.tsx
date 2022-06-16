/* External imports */
import React from 'react'
import styled from 'styled-components'

/* Internal imports */
import MarketGrid from '../MarketGrid'


const MarketBox = ({
  selector,
  isLoading,
  loadCollection,
  userCollections,
  homeCollections
}: any) => {
  return (
    <>
      <Center>
        <MarketGrid
          isLoading={isLoading}
          selector={selector}
          userCollections={userCollections}
          homeCollections={homeCollections}
          loadCollection={loadCollection}
        />
      </Center>
    </>
  )
}

const Center = styled.div`
  margin: auto;
  width: 100%;
  border-radius: 0rem;

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    height: auto;
    max-width: 80%;
  `};
`

export default MarketBox
