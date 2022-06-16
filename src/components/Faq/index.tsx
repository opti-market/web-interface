import React from "react"
import questions from './faq.json'
import FaqPanel from "./FaqPanel"


export function Faq() {
  return (
    <FaqPanel>
      <FaqPanel.Header>Frequently Asked Questions</FaqPanel.Header>
      {questions.map((question) => (
        <FaqPanel.QuestionTextWrap key={question.id}>
          <FaqPanel.Question>{question.question}</FaqPanel.Question>
          <FaqPanel.Text>{question.answer}</FaqPanel.Text>
        </FaqPanel.QuestionTextWrap>
      ))}
      <h4>
        Question not on the list? Ask along on our Discord!
      </h4>
    </FaqPanel>
  )
}


export default Faq
