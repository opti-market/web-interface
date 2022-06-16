/* External imports */
import {ethers} from 'ethers'
import {Signer} from '@ethersproject/abstract-signer'
import {BigNumber} from '@ethersproject/bignumber'
import {JsonRpcProvider, Web3Provider} from '@ethersproject/providers'

/* Internal imports */
import ERC721__Artifact from './artifacts/ERC721.json'
import {
  OPTIMISM_KOVAN_INFURA_URL,
  OPTIMISM_MAINNET_INFURA_URL,
  OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS,
  OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS,
} from '../../utils/utils'
import {ERC721Enumerable} from './types'



export async function totalSupply(
  // contract variables
  assetCollection: any,
  // Web3 user variables
  chainId: number
) {
  if (assetCollection === undefined) {
    return Error('Collection not found!')
  }
  // // If no wallet is connected to Optimism, set the defautl chain to 10
  // if(chainId !== 10 && chainId !== 69) chainId = 10

  let ctcAddress: string = '',
    erc721Enumerable: ERC721Enumerable,
    library_: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
      OPTIMISM_KOVAN_INFURA_URL
    ),
    totalSupply_

  if (chainId === 69) {
    library_ = new ethers.providers.JsonRpcProvider(
      OPTIMISM_KOVAN_INFURA_URL
    )
    ctcAddress = assetCollection.contractAddress__Kovan
  }

  if (chainId === 10) {
    library_ = new ethers.providers.JsonRpcProvider(
      OPTIMISM_MAINNET_INFURA_URL
    )
    ctcAddress = assetCollection.contractAddress__Mainnet
  }

  const abi = assetCollection.artifact.abi

  erc721Enumerable = new ethers.Contract(ctcAddress, abi) as ERC721Enumerable

  try {
    totalSupply_ = await erc721Enumerable.connect(library_).totalSupply()

    return totalSupply_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}