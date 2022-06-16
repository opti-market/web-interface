/* External imports */
import React from 'react'
import styled from 'styled-components'

/* Internal imports */
import WhiteListIcon from '../WhiteListIcon'


function SuspenseAsset() {
  return (
    <HoverShadow>
      <Card>
        <CardUpperContent>
          <CollectionName>
            {''}
          </CollectionName>
          <WhiteListIcon />
        </CardUpperContent>
        <AssetName>
          {``}
        </AssetName>
      </Card>
    </HoverShadow>
  )
}


const Card = styled.div`
  border-width: 0;
  border-radius: 35px;
  border-color: ${ ({ theme }) => theme.white };
  background-color: ${ ({ theme }) => theme.bg1 };

  padding: 0px 0px 15px 0px;
  margin: 30px;

  filter: drop-shadow(0 0 1rem ${ ({ theme }) => theme.primary2 });

  :hover {
    transform: scale(1.006);
    cursor: pointer;
  }

  :active {
    transform: scale(0.999);
  }
`

const CardUpperContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
`

const HoverShadow = styled.div`
  margin: 0px;
  padding: 0px;
  :hover {
    filter: drop-shadow(0 0 0.1rem ${ ({ theme }) => theme.primary2 });
  }
`

const CollectionName = styled.p`
  display: inline-block;
  padding: 2px;
  margin: 5px 0px 0px 10px;
  color: ${ ({ theme }) => theme.text1 };
  font-weight: 700;
  font-size: 13.5px;
`

const AssetName = styled.p`
  padding: 2px;
  margin: 0px 0px 0px 10px;
  color: ${ ({ theme }) => theme.text2 };
  font-weight: 700;
  font-size: 13.5px;
`


export default SuspenseAsset
