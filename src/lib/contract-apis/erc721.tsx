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
import {ERC721} from './types'


export async function transferFrom(
  // contract variables
  assetCollection,
  tokenId: BigNumber,
  to: string,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let erc721: ERC721,
    ctcAddress: string = '',
    transferFrom_

  if (chainId === 69) ctcAddress = assetCollection.contractAddress__Kovan
  if (chainId === 10) ctcAddress = assetCollection.contractAddress__Mainnet

  erc721 = new ethers.Contract(
    ctcAddress,
    ERC721__Artifact.abi
  ) as ERC721

  const sender: Signer = library.getSigner(account)

  try {
    transferFrom_ = await erc721.connect(sender).transferFrom(
      account,
      to,
      tokenId
    )

    if (chainId === 69) {
      console.log(
        'transferFrom() tx receipt: ',
        transferFrom_.hash
      )
      console.log(
        'Optimism Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + transferFrom_.hash
      )
    }

    if (chainId === 10) {
      console.log(
        'transferFrom() tx receipt: ',
        transferFrom_.hash
      )
      console.log(
        'Optimism Mainnet txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + transferFrom_.hash
      )
    }

    return transferFrom_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}

export async function isApprovedForAll(
  // contract variables
  collectionAddress: string,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let erc721: ERC721,
    mktplaceAddress: string = ''

  if (chainId === 69) mktplaceAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
  if (chainId === 10) mktplaceAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS

  erc721 = new ethers.Contract(
    collectionAddress,
    ERC721__Artifact.abi
  ) as ERC721

  const approvedForAll: Signer = library.getSigner(account)

  const isApprovedForAll_ = await erc721.connect(approvedForAll).isApprovedForAll(
    account,
    mktplaceAddress
  )

  return isApprovedForAll_
}


// export async function getApproved(
//   // contract variables
//   tokenId: BigNumber,
//   // Web3 user variables
//   account: string | null | undefined,
//   chainId: number,
//   library: Web3Provider
// ) {
//   if (account == null || account === undefined) {
//     return Error('Account not found!')
//   }

//   let erc721: ERC721,
//     ctcAddress: string = ''

//   if (chainId === 69) ctcAddress = assetCollection.contractAddress__Kovan
//   if (chainId === 10) ctcAddress = assetCollection.contractAddress__Mainnet

//   erc721 = new ethers.Contract(
//     ctcAddress,
//     ERC721__Artifact.abi
//   ) as ERC721

//   const approved: Signer = library.getSigner(account)

//   const getApproved_ = await erc721.connect(approved).getApproved(
//     tokenId
//   )

//   return getApproved_
// }


export async function setApprovalForAll(
  // contract variables
  isApprovedForAll: boolean,
  collectionAddress: any,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }
  let erc721: ERC721,
    ctcAddress: string = '',
    mktplaceAddress: string = '',
    setApprovalForAll_

  ctcAddress = collectionAddress

  if (chainId === 69) {
    // ctcAddress = collectionAddress
    mktplaceAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
  }
  if (chainId === 10) {
    // ctcAddress = collectionAddress
    mktplaceAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  }

  erc721 = new ethers.Contract(
    ctcAddress,
    ERC721__Artifact.abi
  ) as ERC721

  const approved: Signer = library.getSigner(account)

  try {
    setApprovalForAll_ = await erc721.connect(approved).setApprovalForAll(
      mktplaceAddress,
      isApprovedForAll
    )

    if (chainId === 69) {
      console.log(
        'setApprovalForAll() tx receipt: ',
        setApprovalForAll_.hash
      )
      console.log(
        'Optimism Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + setApprovalForAll_.hash
      )
    }

    if (chainId === 10) {
      console.log(
        'setApprovalForAll() tx receipt: ',
        setApprovalForAll_.hash
      )
      console.log(
        'Optimism Mainnet txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + setApprovalForAll_.hash
      )
    }

    return setApprovalForAll_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}


export async function ownerOf(
  // contract variables
  assetCollection: any,
  tokenId: BigNumber,
  // Web3 user variables
  chainId: number,
  library: Web3Provider
) {
  if (assetCollection === undefined) {
    return Error('Collection not found!')
  }
  // // If no wallet is connected to Optimism, set the defautl chain to 10
  // if(chainId !== 10 && chainId !== 69) chainId = 10

  let ctcAddress: string = '',
    erc721: ERC721,
    library_: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
      OPTIMISM_KOVAN_INFURA_URL
    ),
    ownerOf_

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

  erc721 = new ethers.Contract(ctcAddress, abi) as ERC721

  try {
    ownerOf_ = await erc721.connect(library_).ownerOf(tokenId)

    return ownerOf_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}


export async function tokenURI(
  // contract variables
  assetCollection: any,
  tokenId: BigNumber,
  // Web3 user variables
  chainId: number,
  library: Web3Provider
) {
  if (assetCollection === undefined) {
    return Error('Collection not found!')
  }
  // // If no wallet is connected to Optimism, set the defautl chain to 10
  // if(chainId !== 10 && chainId !== 69) chainId = 10

  let ctcAddress: string = '',
    erc721: ERC721,
    library_: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
      OPTIMISM_KOVAN_INFURA_URL
    ),
    tokenURI_

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

  erc721 = new ethers.Contract(ctcAddress, abi) as ERC721

  try {
    tokenURI_ = await erc721.connect(library_).ownerOf(tokenId)

    console.log("token URI =", tokenURI_)

    return tokenURI_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}
