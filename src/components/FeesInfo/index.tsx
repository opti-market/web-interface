import React from 'react'
import styled from 'styled-components'
import Tooltip from '../Tooltip'
import { useIsDarkMode } from '../../state/user/hooks'
import QuestionMarkGold from '../../assets/images/question_mark_gold.png'
import QuestionMarkBlack from '../../assets/images/question_mark_black.png'


const FeesInfo = ({ collection, chainId }) => {
  const darkMode = useIsDarkMode()

  // These fees are hardcoded here for now
  const optiMarketFee = 1
  const optiMarketPGF = 0.5

  const feesShortDescription = `Transaction fees paid by seller`
  // const feesShortDescription = `Fees paid by seller: ${totalOptiMarketFees}% + ${totalCreatorRoyalties}%`

  const content1 = `OptiMarket Fee: ${ optiMarketFee }%,`
  const content2 = `PGF (Public Goods Funding) Fee: ${ optiMarketPGF }%,`
  const content3 = `Creator Royalty: ${ collection.ownerRoyalty }%,`
  const content4 = `Creator PGF: ${ collection.ownerPGF }%`

  return (
    <>
      <AlignTooltip>
        <RoyaltyFee>{feesShortDescription}</RoyaltyFee>
        <Tooltip
          content1={content1}
          content2={content2}
          content3={content3}
          content4={content4}
          role='text'
          aria-label='OptiMarket and Creator Royalty Fees'
        >
          <img
            src={darkMode ? QuestionMarkGold : QuestionMarkBlack}
            alt='question-mark'
            width='auto'
            height='13.5px'
          />
        </Tooltip>
      </AlignTooltip>
    </>
  )
}


const AlignTooltip = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;
`

const RoyaltyFee = styled.div`
  margin: 0px 0px;
  padding-right: 5px;
  font-size: 13.5px;
  font-weight: 600;
  color: ${ ({ theme }) => theme.text2 };
`


export default FeesInfo