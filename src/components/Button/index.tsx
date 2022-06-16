import styled from 'styled-components'
import { Button as RebassButton } from 'rebass/styled-components'

const Base = styled(RebassButton) <{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  padding: ${ ({ padding }) => (padding ? padding : '18px') };
  width: ${ ({ width }) => (width ? width : '100%') };
  
  font-weight: 500;
  
  flex-wrap: nowrap;

  text-align: center;
  text-decoration: none;
  
  border-radius: 12px;
  border-radius: ${ ({ borderRadius }) => borderRadius && borderRadius };
  border: 1px solid transparent;
  
  outline: none;
  
  color: white;
  
  cursor: pointer;
  
  z-index: 1;
  
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonSecondary = styled(Base)`
  border: 1px solid ${ ({ theme }) => theme.primary4 };
  
  color: ${ ({ theme }) => theme.primary1 };
  
  background-color: transparent;
  
  font-size: 16px;
  
  border-radius: 12px;
  padding: ${ ({ padding }) => (padding ? padding : '10px') };

  &:focus {
    box-shadow: 0 0 0 1pt ${ ({ theme }) => theme.primary4 };
    border: 1px solid ${ ({ theme }) => theme.primary3 };
  }
  
  &:hover {
    border: 1px solid ${ ({ theme }) => theme.primary3 };
  }

  &:active {
    box-shadow: 0 0 0 1pt ${ ({ theme }) => theme.primary4 };
    border: 1px solid ${ ({ theme }) => theme.primary3 };
  }
  
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }

  a:hover {
    text-decoration: none;
  }
`
