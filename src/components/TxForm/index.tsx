/* External exports */
import React from 'react'
import styled from 'styled-components'


const TxForm = (props: {
  onSubmit: any,
  placeholder: string,
  formName: string,
  onChange: any,
  revertMsg: any,
  ctcCallReverted: any,
  children?: React.ReactNode,
  inputMode?: "text" | "search" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | undefined
}): any => {
  return (
    <>
      <form onSubmit={props.onSubmit}>
        <label>
          <FormInput
            placeholder={props.placeholder} // '0.420 (ETH)'
            type={props.inputMode === 'text' ? 'text' : 'number'}
            step={props.inputMode === 'text' ? '' : 'any'}
            inputMode={props.inputMode ? props.inputMode : 'decimal'}
            name={props.formName} // 'weth amount to approve'
            onChange={props.onChange} // handleSetETHAmount
          />
        </label>
        {props.children}
      </form>
    </>
  )
}


const FormInput = styled.input`
  padding: 12px 12px;
  margin: 15px 0px 5px 0px;
  width: 210px;

  border-style: solid;
  border-width: 0.1rem;
  border-radius: 4rem;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  [type=number] {
    -moz-appearance: textfield;
  }

  color: ${ ({ theme }) => theme.text2 };
  background-color: ${ ({ theme }) => theme.bg1 };

  text-align: center;
  text-overflow: ellipsis;
  font-size: 18px;
  
  filter: drop-shadow(0 0.01rem 0.12rem ${ ({ theme }) => theme.text2 });

  :focus {
    outline: none;
    color: ${ ({ theme }) => theme.text2 };
    text-overflow: ellipsis;
    filter: drop-shadow(0 0.01rem 0.2rem ${ ({ theme }) => theme.text2 });
  }

  :placeholder {
    color: ${ ({ theme }) => theme.text4 };
  }
`


export default TxForm 