import React from 'react'
import styled from 'styled-components'
import Tooltip from '../Tooltip'
import { useIsDarkMode } from '../../state/user/hooks'
import QuestionMarkGold from '../../assets/images/question_mark_gold.png'
import QuestionMarkBlack from '../../assets/images/question_mark_black.png'



const InfoTooltip = (props) => {
  const darkMode = useIsDarkMode()

  let displayMessage = ''
  if (props.message) displayMessage = props.message



  // If displaying extra lines of text, add more content#s and use .map below. 
  // Be careful to not affect previous uses of this component.

  // const content2 = `some message`


  return (
    <>
      <AlignTooltip>
        <InfoMessage>{displayMessage}</InfoMessage>
        <Tooltip
          content1={props.content1}
          role='text'
          aria-label={props.label}
        >
          <img
            src={darkMode ? QuestionMarkGold : QuestionMarkBlack}
            alt='question-mark'
            width='auto'
            height={props.questionMarkHeight}
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

const InfoMessage = styled.div`
  margin: 0px 0px;
  padding-right: 5px;
  font-size: 13.5px;
  font-weight: 600;
  color: ${ ({ theme }) => theme.text2 };
`


export default InfoTooltip