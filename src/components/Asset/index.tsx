/* External imports */
import React, { useState } from 'react'
import { Tag } from 'react-feather'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

/* Internal imports */
import WhiteListIcon from '../WhiteListIcon'
import CoreAppSuspense from '../Suspense/CoreAppSuspense'
import { tokenImageURL } from '../../utils/utils'
import EthereumLogo from '../../assets/images/ethereum-logo.svg'


function Asset({ tokenId, price, activeOffer, rarity, collection }) {
  const [isHidden, setIsHidden] = useState<boolean>(true)

  if (price === undefined) price = 0
  if (activeOffer === undefined) activeOffer = 0
  if (rarity === undefined) rarity = 0

  let showPrice = false,
    showActiveOffer = false,
    showRarity = false,
    priceFloat = parseFloat(price),
    activeOfferFloat = parseFloat(activeOffer),
    rarityFloat = parseFloat(rarity)

  // Note that the showPrice & showActiveOffer booleans below must be global
  if (priceFloat > 0) showPrice = true
  if (activeOfferFloat > 0) showActiveOffer = true
  if (rarityFloat > 0) showRarity = true

  const tokenImgUrl = tokenImageURL(tokenId, collection)

  let assetName = `${ collection.asset_name_prefix } #${ tokenId }`
  // If the contract type is fungible, then only show the collection/asset name
  if (collection.contract_type === "fungible") assetName = ''

  const getRoundedPrice = (valueFloat: any, visibility: any) => {
    let priceRounded: number = 0.0

    if (visibility) {
      if (valueFloat < 10) priceRounded = Number(valueFloat.toFixed(3))
      if (valueFloat > 9.999) priceRounded = Number(valueFloat.toFixed(2))
      if (valueFloat > 99.99) priceRounded = Number(valueFloat.toFixed(1))
    }
    return priceRounded
  }

  const roundedPrice = getRoundedPrice(priceFloat, showPrice)
  const roundedActiveOffer = getRoundedPrice(activeOfferFloat, showActiveOffer)

  const offerAlert = 'BID '

  /**
   * @dev When `_onLoad` is passed to `TokenImg`'s `onLoad` property, it will
   *      withhold displaying the token image until the image has fully loaded.
   */
  const _onLoad = () => {
    setIsHidden(false)
  }


  return (
    <Card key={ tokenId }>
      <StyledLink to={ `/AssetDetails/${ collection.slug }/${ tokenId }` }>
        { isHidden ? (
          <>
            <CenterSuspense>
              {/* <Spinner /> */ }
              <CoreAppSuspense />
            </CenterSuspense>
          </>
        ) : (
          <></>
        ) }
        <TokenImg
          src={ tokenImgUrl }
          alt='Asset'
          onLoad={ _onLoad }
          hidden={ isHidden }
        />
        <CardUpperContent>
          <CollectionName>{ collection.name }</CollectionName>
          <IconWrap>
            <WhiteListIcon />
          </IconWrap>
          { showPrice ? (
            <>
              <LastPriceWrap>
                <ETHLogo src={ EthereumLogo } alt={ "EthereumLogo" } />
                { roundedPrice }
              </LastPriceWrap>
            </>
          ) : (
            <>
            </>
          ) }
        </CardUpperContent>
        <CardLowerContent>
          <AssetName>{ assetName }</AssetName>
          <ActiveOffer>
            { showActiveOffer ? (
              <>
                <Tag height={ '18px' } style={ { marginRight: '3px', marginTop: '1px' } } />{ offerAlert }{ roundedActiveOffer }
              </>
            ) : (
              <>
              </>
            ) }
          </ActiveOffer>
          <ActiveOffer>
            { showRarity && !showActiveOffer ? (
              <>
                { `Rarity #${ rarity }` }
              </>
            ) : (
              <>
              </>
            ) }
          </ActiveOffer>
        </CardLowerContent>
      </StyledLink>
    </Card>
  )
}


export const CenterSuspense = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;

  // For Spinner
  // margin: 105px;
  
  // For 'Loading...' text
  margin: 126.78px 88.18px; // (357 x 290)

  color: white;
`

const Card = styled.div`
  display: flex;
  border-radius: 35px;
  background-color: ${ ({ theme }) => theme.bg1 };

  padding-bottom: 15px;
  margin: 30px;

  box-shadow: 0 0 0.2rem ${ ({ theme }) => theme.primary2 };

  :hover {
    transform: scale(1.006);
    filter: drop-shadow(0 0 1rem ${ ({ theme }) => theme.primary2 });
    cursor: pointer;
  }

  :active {
    transform: scale(0.999);
  }

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    height: auto;
    max-width: 100%;
  `};
`

const StyledLink = styled(Link)`
  :link {  text-decoration: none;  }
`

const TokenImg = styled.img`
  border-width: 1px;
  border-radius: 35px 35px 0px 0px;
  height: 290px;
  width: auto;

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    height: auto;
    max-width: 100%;
`};
`

const CardUpperContent = styled.div`
  display: flex;
  align-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 5px 0px 5px 15px;
`

const CollectionName = styled.div`
  display: flex;
  color: ${ ({ theme }) => theme.text1 };
  font-weight: 700;
  font-size: 16px;
`

const IconWrap = styled.div`
  display: flex;

  svg {
    height: 20px;
    width: auto;
    margin: 0px 0px 0px 5px;
  }
`

const ETHLogo = styled.img`
  height: 20px;
  margin: auto;
  padding-right: 5px;
`

const LastPriceWrap = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: 15px;
  color: ${ ({ theme }) => theme.text1 };
  font-weight: 700;
  font-size: 16px;
`

const CardLowerContent = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 15px;
`

const AssetName = styled.div`
  display: flex;
  padding: 0px;
  margin-left: 15px;
  color: ${ ({ theme }) => theme.text2 };
`

const ActiveOffer = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: 15px;
  color: ${ ({ theme }) => theme.text1 };
`

export default Asset
