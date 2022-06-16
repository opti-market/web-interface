import React from 'react'
import styled from 'styled-components'

export const TransferButton = (props: {
  disabled?: boolean | undefined,
  type: "button" | "submit" | "reset" | undefined,
  buttonName: string,
  onClick?: any
}): any => {
  return (
    <>
      {props.disabled ? (
        <>
          <DisabledTransferButton disabled={props.disabled} type={props.type}>
            {props.buttonName}
          </DisabledTransferButton>
        </>
      ) : (
        <>
          <StyledTransferButton
            disabled={props.disabled}
            type={props.type}
            onClick={props.onClick}
          >
            {props.buttonName}
          </StyledTransferButton>
        </>
      )}
    </>
  )
}


const DisabledTransferButton = styled.button`
  color: ${ ({ theme }) => theme.text3 };
  
  font-weight: 600;
  font-size: 16px;

  text-decoration: none;

  width: 130px;

  background-color: transparent;

  padding: 14px 16px;
  margin: 10px 10px 0px 10px;

  border-radius: 3rem;
  border-style: none;

  box-shadow: 0.51px 0.51px 4px ${ ({ theme }) => theme.primary4 };

  :hover {
    filter: drop-shadow(0 0 0.001px ${ ({ theme }) => theme.primary4 });
  }

  :active {
    transform: scale(0.99);
  }
`

const StyledTransferButton = styled.button`
  color: ${ ({ theme }) => theme.text2 };
  
  font-weight: 600;
  font-size: 16px;

  text-decoration: none;

  width: 130px;

  background-color: transparent;

  padding: 14px 16px;
  margin: 10px 10px 0px 10px;

  border-radius: 3rem;
  border-style: none;

  box-shadow: 0.51px 0.51px 4px ${ ({ theme }) => theme.text2 };

  :hover {
    filter: drop-shadow(0 0 0.001px ${ ({ theme }) => theme.primary2 });
    transform: scale(1.02);
    cursor: pointer;
  }

  :active {
    transform: scale(0.99);
  }
`