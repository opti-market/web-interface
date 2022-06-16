/* External imports */
import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Moon, Sun } from 'react-feather'

/* Internal imports */
import { EXTERNAL_LINKS } from '../../constants/links'
import { useDarkModeManager } from '../../state/user/hooks'
import OptiLogo from '../../assets/svg/optimarket.svg'


export default function Footer() {
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  return (
    <FooterContainer>
      <FooterDescription>
        <MarketLogo src={OptiLogo} alt={"OptiLogo"} />
        <FooterDescriptionHeading>
          OptiMarket - your community marketplace for crypto collectibles and
          non-fungible tokens (NFTs) on Optimism.
        </FooterDescriptionHeading>
      </FooterDescription>
      <PositionToggle>
        <ToggleMenu onClick={() => toggleDarkMode()}>
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </ToggleMenu>
      </PositionToggle>
      <FooterLinks>
        <FooterLinksWrapper>
          <FooterLinksItems>
            <h2>OptiMarket</h2>
            <Links to='/'>OptiMarket</Links>
            <Links to='/Profile'>Profile</Links>
            <Links to='/collection/optipunks'>OptiPunks</Links>
            <Links to='/collection/optimisticbunnies'>Optimistic Bunnies</Links>
          </FooterLinksItems>
          <FooterLinksItems>
            <h2>Resources</h2>
            <Links to='/Faq'>FAQ</Links>
          </FooterLinksItems>
          <FooterLinksItems>
            <h2>Social Media</h2>
            <External href={EXTERNAL_LINKS.Social.Twitter}>Twitter</External>
            <External href={EXTERNAL_LINKS.Social.Discord}>Discord</External>
          </FooterLinksItems>
        </FooterLinksWrapper>
      </FooterLinks>
    </FooterContainer>
  )
}


const PositionToggle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ToggleMenu = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  
  padding: 0.5rem;
  
  margin-top: 5px;
  
  background-color: transparent;

  color: ${ ({ theme }) => theme.text2 };

  border-width: 2px;
  border-radius: 3rem;
  border-color: ${ ({ theme }) => theme.primary2 };

  :hover {
    color: ${ ({ theme }) => theme.primary2 };
    text-decoration: none;
    transform: scale(1.05);
  }
`

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: transparent;
  
  padding: 2rem 0 2rem 0;
  
  width: 100%;
  
  border-top: 2px solid ${ ({ theme }) => theme.text1 };
`

const FooterDescription = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  margin: 0px 50px 0px 50px;

  max-width: 900px;
  
  text-align: center;

  overflow-wrap: break-word;
`

const FooterDescriptionHeading = styled.p`
  margin-bottom: 24px;
  font-size: 24px;
  margin-left: 5%;
  margin-right: 5%;
`

const MarketLogo = styled.img`
  height: 150px;
  width: auto;
  margin: auto;
  border-radius: 50%;
`

const FooterLinks = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: center;
`

const FooterLinksWrapper = styled.div`
  display: flex;

  ${ ({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};
`

const FooterLinksItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin: 16px;
  
  text-align: left;
  
  line-height: 2;
  
  width: 160px;
  
  box-sizing: border-box;
`

const Links = styled(Link)`
  color: ${ ({ theme }) => theme.text2 };
  
  padding-bottom: 8px;

  :hover {
    color: ${ ({ theme }) => theme.primary2 };
    text-decoration: none;
  }
`

const External = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  color: ${ ({ theme }) => theme.text2 };
 
  padding-bottom: 8px;

  :hover {
    color: ${ ({ theme }) => theme.primary2 };
    text-decoration: none;
  }
`
