/* External imports */
import { ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { Signer } from '@ethersproject/abstract-signer'
import { Web3Provider } from '@ethersproject/providers'

/* Internal imports */
import { WETH9 } from './types/WETH9'
import WETH9__Artifact from './artifacts/WETH9.json'
import {
  OPTIMISM_KOVAN_RPC_URL,
  OPTIMISM_MAINNET_RPC_URL,
  OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS,
  OPTI_KOVAN_WETH9_ADDRESS,
  OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS,
  OPTI_MAINNET_WETH9_ADDRESS
} from '../../utils/utils'


export async function balanceOf(
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let weth9: WETH9,
    ctcAddress = '',
    balanceOf_: any

  if (chainId === 69) ctcAddress = OPTI_KOVAN_WETH9_ADDRESS
  if (chainId === 10) ctcAddress = OPTI_MAINNET_WETH9_ADDRESS

  weth9 = new ethers.Contract(
    ctcAddress,
    WETH9__Artifact.abi
  ) as WETH9

  try {
    balanceOf_ = await weth9.connect(library).balanceOf(account)

    return balanceOf_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }

}

export async function allowance(
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let weth9: WETH9,
    ctcAddress = '',
    mktplaceAddress = ''

  if (chainId === 69) {
    ctcAddress = OPTI_KOVAN_WETH9_ADDRESS
    mktplaceAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
  }

  if (chainId === 10) {
    ctcAddress = OPTI_MAINNET_WETH9_ADDRESS
    mktplaceAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  }

  weth9 = new ethers.Contract(
    ctcAddress,
    WETH9__Artifact.abi
  ) as WETH9

  const allowance_ = await weth9.connect(library).allowance(
    account,
    mktplaceAddress
  )

  return allowance_
}


export async function approveWETH9(
  // contract variables
  wad: BigNumber, // amount to approve
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let weth9: WETH9,
    ctcAddress = '',
    guy: string = '',
    approve_

  if (chainId === 69) {
    ctcAddress = OPTI_KOVAN_WETH9_ADDRESS
    guy = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
  }

  if (chainId === 10) {
    ctcAddress = OPTI_MAINNET_WETH9_ADDRESS
    guy = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  }

  weth9 = new ethers.Contract(
    ctcAddress,
    WETH9__Artifact.abi
  ) as WETH9

  const buyer: Signer = library.getSigner(0)

  try {
    approve_ = await weth9.connect(buyer).approve(
      guy,
      wad
    )

    if (chainId === 69) {
      console.log('approve() tx receipt: ', approve_)
      console.log(
        'Optimistic Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + approve_.hash
      )
    }
    if (chainId === 10) {
      console.log('approve() tx receipt: ', approve_)
      console.log(
        'Optimistic Ethereum txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + approve_.hash
      )
    }

    return approve_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}
