/* External imports */
import React, { useState, createContext } from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'

/* Internal imports */
import { EXTERNAL_LINKS } from '../../constants/links'


interface Status {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const QuestionContext = createContext({} as Status)

export default function FaqPanel({ children, ...restProps }) {
  return (
    <FaqContainer {...restProps}>
      <Inner>{children}</Inner>
    </FaqContainer>
  )
}

FaqPanel.Header = function FaqPanelHeader({ children, ...restProps }) {
  return <Header {...restProps}> {children}</Header>
}

FaqPanel.QuestionTextWrap = function FaqPanelEntity({ children, ...restProps }) {
  const [open, setOpen] = useState<boolean>(false)


  return (
    <QuestionContext.Provider value={{ open, setOpen }}>
      <QuestionTextWrap {...restProps}>
        {children}
      </QuestionTextWrap>
    </QuestionContext.Provider>
  )
}

FaqPanel.Question = function FaqPanelHeader({ children, ...restProps }) {
  const { open, setOpen } = React.useContext(QuestionContext)

  return (
    <QuestionBox onClick={() => setOpen((open) => !open)} {...restProps}>
      {children}
      {open ? (
        <h3>-</h3>
      ) : (
        <h3>+</h3>
      )}
    </QuestionBox>
  )
}

FaqPanel.Text = function FaqPanelText({ children, ...restProps }) {
  const { open } = React.useContext(QuestionContext)

  return (
    <>
      {open ? (
        <AnswerBox {...restProps}>
          <Trans components={[
            <External href={EXTERNAL_LINKS.FAQ.OpChainid} />,
            <External href={EXTERNAL_LINKS.FAQ.OpBridge} />,
            <External href={EXTERNAL_LINKS.FAQ.OpEcosystem} />,
            <External href={EXTERNAL_LINKS.FAQ.Uniswap} />,
          ]}>
            {children}
          </Trans>
        </AnswerBox>
      ) : (
        null
      )}
    </>
  )
}

const FaqContainer = styled.div`
  display: flex;
  text-align: center;
`

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
`

const Header = styled.h1`
  color: ${ ({ theme }) => theme.text2 };
  font-size: 40px;
  text-align: center;
`

const QuestionTextWrap = styled.div`
  width: 600px;
  
  padding: 5px 75px;
  margin: 25px;
  
  text-align: center;
  
  font-size: 16px;
  font-weight: 600;
  
  color: ${ ({ theme }) => theme.text2 };

  border-radius: 3rem;
  border-color: ${ ({ theme }) => theme.white };
  
  background-color: ${ ({ theme }) => theme.bg1 };
  
  box-shadow: .02rem 0.2rem 2rem ${ ({ theme }) => theme.text2 };

  :hover {
    transform: scale(1.05);
  }
`

const QuestionBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  text-align: left;
  
  font-size: 20px;
  font-weight: 600;
`

const AnswerBox = styled.div`
  display: flex;
  
  margin-bottom: 25px;
  
  text-align: left;
  
  font-size: 17px;
  font-weight: 500;
  
  user-select: none;
  
  white-space: pre-wrap;
`

const External = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  display: contents;
  color: ${ ({ theme }) => theme.primary2 };

  :hover {
    color: ${ ({ theme }) => theme.text1 };
    text-decoration: none;
  }
`
