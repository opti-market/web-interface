import React from 'react'
import { darken } from 'polished'
import styled from 'styled-components'


/**
 * @dev We generalize this `ButtonTernary` component so that we don't have to
 *      define a _`Button` styled-component_ in every component file where we
 *      need it.
 */
const ButtonTernary = (props: {
  conditional?: boolean | undefined,
  defaultButtonName: string,
  secondaryButtonName?: string | undefined,
  type?: "button" | "submit" | "reset" | undefined,
  onClick?: any,
  disabled?: boolean | undefined
}) => {
  return (
    <>
      {props.disabled ? (
        <>
          <DisabledButton disabled={props.disabled}>
            {props.conditional ? <>{props.defaultButtonName}</>
              : <>{props.secondaryButtonName}</>
            }
          </DisabledButton>
        </>
      ) : (
        <>
          <Button type={props.type} onClick={props.onClick} disabled={props.disabled}>
            {props.conditional ? <>{props.defaultButtonName}</>
              : <>{props.secondaryButtonName}</>
            }
          </Button>
        </>
      )}
    </>
  )
}


const Button = styled.button`
  text-align: center;

  margin: 17px 0px;
  padding: 20px 40px;

  border-radius: 3rem;
  border-outline: none;
  border-style: none;

  background-color: ${ ({ theme }) => theme.primary1 };

  filter: drop-shadow(0 0 0.3rem ${ ({ theme }) => theme.primary1 });

  :hover {
    background - color: ${ ({ theme }) => darken(0.1, theme.primary1) };
    transform: scale(1.02);
    cursor: pointer;
  }

  :active {
    transform: scale(0.98);
  }

  font-weight: 700;
  font-size: 18px;

  color: ${ ({ theme }) => theme.white };
`

const DisabledButton = styled.button`
  text-align: center;

  margin: 17px 0px;
  padding: 20px 40px;

  border-radius: 3rem;
  border-outline: none;
  border-style: none;

  background-color: ${ ({ theme }) => theme.primary5 };

  filter: drop-shadow(0 0 0.3rem ${ ({ theme }) => theme.primary1 });

  font-weight: 700;
  font-size: 18px;

  color: ${ ({ theme }) => theme.bg4 };
`


export default ButtonTernary