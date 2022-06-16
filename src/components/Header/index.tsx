/* External imports */
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

/* Internal imports */
import SearchBar from '../SearchBar'
import Web3Status from '../Web3Status'
import { useActiveWeb3React } from '../../hooks'
import OptiLogo from '../../assets/svg/optimarket.svg'


const NETWORK_LABELS = {
  10: 'Optimism',
  69: 'OΞ Kovan',
  1: 'Ethereum',
  3: 'Rinkeby',
  4: 'Ropsten',
  5: 'Görli',
  42: 'Kovan'
}

function hexToRgbA(hex: string, opacity: number) {
  let c: any

  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('')

      if (c.length === 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }

      c = '0x' + c.join('')

      return (
        'rgba(' + 
        [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `, ${opacity})`
      )
  }

  throw new Error('Bad Hex')
}


function hexToHSL(H, opacity?) {
  // Convert hex to RGB first
  let r: any = 0, g: any = 0, b: any = 0

  if (H.length === 4) {
    r = "0x" + H[1] + H[1]
    g = "0x" + H[2] + H[2]
    b = "0x" + H[3] + H[3]
  } else if (H.length === 7) {
    r = "0x" + H[1] + H[2]
    g = "0x" + H[3] + H[4]
    b = "0x" + H[5] + H[6]
  }

  // Then to HSL
  r /= 255
  g /= 255
  b /= 255

  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta === 0)
    h = 0
  else if (cmax === r)
    h = ((g - b) / delta) % 6
  else if (cmax === g)
    h = (b - r) / delta + 2
  else
    h = (r - g) / delta + 4

  h = Math.round(h * 60)

  if (h < 0) h += 360

  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  if (opacity) {
    return "hsl(" + h + "," + s + "%," + l + "%," + opacity + ")"
  } else {
    return "hsl(" + h + "," + s + "%," + l + "%)"
  }
}



export default function Header() {
  const { chainId } = useActiveWeb3React()


  return (
    <HeaderFrame>
      <HeaderLinks>
        <HeaderLogo src={OptiLogo} alt={OptiLogo} />
        <LogoLink to='/'>OptiMarket</LogoLink>
        <NavLinks to='/Profile'>Profile</NavLinks>
        <NavLinks to='/Collections'>Collections</NavLinks>
      </HeaderLinks>
      <HeaderSearch>
        <SearchBar />
      </HeaderSearch>
      <HeaderControls>
        <HeaderElement>
          {chainId && NETWORK_LABELS[chainId] ? (
            <NetworkStatusCardOutline
              title='You are currently on this network'
            >
              <NetworkStatusCard>
                <NetworkStatus>{NETWORK_LABELS[chainId]}</NetworkStatus>
              </NetworkStatusCard>
            </NetworkStatusCardOutline>
          ) : (
            <>
              <LoadingMenu>Loading Network...</LoadingMenu>
            </>
          )}
          <AccountElement style={{ pointerEvents: 'auto' }}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}


const HeaderFrame = styled.div`
  display: grid;
  justify-content: space-between;
  flex-direction: row;
  align-items: left;
  
  grid-template-columns: 1fr 1fr 1fr;

  border-radius: 0px 0px 20px 20px;
  border-width: 0.1px;
  
  filter: drop-shadow(0rem 0rem 0.15rem ${ ({ theme }) => hexToHSL(theme.text1, 0.23) });
  backdrop-filter: blur(15px);

  width: 100%;

  top: 0;
  left: 0;
  position: fixed;
  
  overflow: visible;

  padding: 0.5rem;

  z-index: 2;

  background-color: ${ ({ theme }) => hexToHSL(theme.bg1, 0.2) };

  ${ ({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr 1fr 1fr;
    padding: 0.4rem;
  `};

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
    flex-direction: column;
    opacity: 100%;
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-self: flex-end;

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    justify-content: center;
  `};
`

const HeaderLinks = styled.div`
  display: flex;
  align-items: center;

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
   width: 100%;
   justify-content: center;
   margin: 10px 0 10px 0;
  `};
`

const HeaderSearch = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  line-height: 22.5px;
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  gap: 8px;

  ${ ({ theme }) => theme.mediaWidth.upToMedium`
  margin: 10px;
  `};
`

const NavLinks = styled(NavLink)`
  border-radius: 3rem;
  
  outline: none;
  cursor: pointer;
  
  text-decoration: none;

  color: ${ ({ theme }) => theme.text2 };

  font-size: 1.03rem;
  font-weight: 600;

  width: fit-content;
  
  margin: 0 12px;

  :hover,
  :focus {
    color: ${ ({ theme }) => theme.primary2 };
  }
`

const LogoLink = styled(NavLinks)`
  font-weight: 800;
`

const NetworkStatusCardOutline = styled.div`
  background-color: transparent;
  border-radius: 0rem;
  padding: 1.2px 1.2px;
`

const NetworkStatusCard = styled.div`
  display: flex;
  
  margin-top 1.8px;
  padding: 6px 14px 6px 14px;
  
  border-radius: 3rem;
  
  background-color: ${ ({ theme }) => theme.bg5 };
`

const NetworkStatus = styled.div`
  display: inline-block;
  
  white-space: nowrap;
  
  text-align: center;
  
  font-weight: 700;
  
  color: #fff;
`

const LoadingMenu = styled.div`
  display: inline-block;
  
  text-align: left;
  
  font-size: 14.5px;
  
  animation: fadeinout 0.7s linear 4 forwards;

  @keyframes fadeinout {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`

const AccountElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  
  background-color: transparent;
  
  white-space: nowrap;
  
  width: 100%;

  :hover {
    cursor: default;
  }
`

const HeaderLogo = styled.img`
  height: 35px;
  
  width: auto;
  
  border-radius: 50%;
  
  margin: 0px 5px 0px 15px;

  ${ ({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
  `};
`
