import React from 'react'
import styled from 'styled-components'
import { Twitter, Monitor } from 'react-feather'
import Tooltip from '../Tooltip'
// import EthereumLogo from '../../assets/images/ethereum-logo.svg'


const Metrics = ({ collection }) => {
  /**
   * @todo All four of these state variables must be dynamically set based on
   *       fetched market data; import useState if needed.
   *
   * Priority Level:   low

  const [owners, setOwners] = useState(3_300)
  const [floorPrice, setFloorPrice] = useState(1)
  const [volumeTraded, setVolumeTraded] = useState(1_400)
  */
  const optiMarketPGF = 0.5
  const totalPgfFees: number = optiMarketPGF + collection.ownerPGF
  return (
    <>
      <Center>
        <MetricBox>
          <MetricTitle>Items:</MetricTitle>{collection.token_count}
        </MetricBox>
        <MetricBox>
          <MetricTitle>Website</MetricTitle>
          <External href={collection.external_url}>
            <Monitor size={24} />
          </External>
        </MetricBox>
        <MetricBox>
        <MetricTitle>Twitter</MetricTitle>
          <External href={collection.twitter_username}>
            <Twitter size={24} />
          </External>
        </MetricBox>
        <MetricBox>
          <Tooltip
            content1="Percentage of seller fees that are donated to Public Goods Funding (PGF)"
            role='text'
            aria-label='Percentage of each NFT sale donating to Public Goods Funding'
          >
            <MetricTitle>PGF</MetricTitle>
          </Tooltip>
          {totalPgfFees}%
        </MetricBox>
      </Center>
    </>
  )
}

/** 
 * @todo Later calculated funds accumulated through sales
  <MetricBox>
    <MetricTitle>Collected Funding:</MetricTitle>
    42 ETH
  </MetricBox>
*/

/**
const ETHLogo = styled.img`
  height: 15px;
  width: auto;
  margin: 0px 10px 2px 0px;
`
*/

const Center = styled.div`
  display: flex;
  justify-content: center;
  
  padding: 20px;
  width: 100%;
  
  grid-column-template: 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    width: 75%;
  `};
`

const MetricBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  
  padding: 15px 50px;
  margin: 1%;

  font-size: 20px;
  font-weight: 600;

  border: 1px solid ${ ({ theme }) => theme.text2 };
  border-radius: 8px;

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    margin: 10px;
  `};
`

const MetricTitle = styled.span`
  margin-bottom: 5px;
  text-align: center;
  color: ${ ({ theme }) => theme.text2 }
`

const External = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  color: ${ ({ theme }) => theme.text2 };

  :hover {
    color: ${ ({ theme }) => theme.primary2 };
    text-decoration: none;
    cursor: pointer;
    opacity: 0.7;
    transform: scale(1.006);
  }

  :active {
    transform: scale(0.99)
  }
`

const TextWrap = styled.div`
  display: flex;
  align-items: center;
`

export default Metrics
