/* External imports */
import { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

/* Internal imports */
import { CenterSuspense } from '../Asset'
import CoreAppSuspense from '../Suspense/CoreAppSuspense'
import { OPTIMARKET_AWS_URL, whitelist, WhitelistInterface } from '../../utils/utils'


const CollectionOverview = () => {
  const [isHidden, setIsHidden] = useState<boolean>(true)

  const _onLoad = () => {
    setIsHidden(false)
  }

  return (
    <>
      <h1>Collections</h1>
      <CollectionWrap>
        {whitelist.map((whitelistedCollection: WhitelistInterface) => (
          <CollectionBox key={whitelistedCollection.id}>
            <StyledLink
              to={`/collection/${ whitelistedCollection.slug }`}
            >
              {(whitelistedCollection.overview_image.toString() === "") ? (
                <>
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
                  <TokenImg
                    onLoad={_onLoad}
                    hidden={isHidden}
                    src={
                      `${ OPTIMARKET_AWS_URL }${ whitelistedCollection.image_hash }/${ whitelistedCollection.image_name_prefix }42.png`
                    }
                  />
                </>
              ) : (
                <TokenImg src={whitelistedCollection.overview_image} />
              )}
              <CardUpperContent>
                <CollectionName>{whitelistedCollection.name}</CollectionName>
              </CardUpperContent>
            </StyledLink>
          </CollectionBox>
        ))}
      </CollectionWrap>
    </>
  )
}


const CollectionWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: space-evenly;
`

const CollectionBox = styled.div`
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
`

const TokenImg = styled.img`
  border-width: 1px;
  border-radius: 35px 35px 0px 0px;
  height: 290px;
  width: auto;
`

const CardUpperContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 10px;
`

const CollectionName = styled.div`
  display: flex;
  color: ${ ({ theme }) => theme.text1 };
  font-weight: 700;
  font-size: 20px;
`

const StyledLink = styled(Link)`
  :link {  text-decoration: none;  }
`

export default CollectionOverview
