import {ethers, Signer} from 'ethers'
import {Web3Provider} from '@ethersproject/providers'
import {BigNumber} from '@ethersproject/bignumber'

import MarketPlace__Artifact from './artifacts/Marketplace.json'
import {Marketplace, OfferStructOutput} from './types/Marketplace'
import {
  initZero,
  OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS,
  OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS,
  OPTIMISM_MAINNET_INFURA_URL,
  OPTIMISM_KOVAN_RPC_URL,
  OPTIMISM_KOVAN_INFURA_URL
} from '../../utils/utils'


export async function listToken(
  // contract variables
  collectionAddress: string,
  tokenId: BigNumber,
  price: BigNumber,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    listToken_

  if (chainId === 10) ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  else if (chainId === 69) ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  const seller: Signer = library.getSigner(account)

  let listingType: BigNumber = initZero,
    decreaseTime: BigNumber = initZero,
    decreasePercentage: BigNumber = initZero,
    minPrice: BigNumber = initZero,
    maxPrice: BigNumber = initZero

  try {
    listToken_ = await marketplace.connect(seller).listToken(
      collectionAddress,
      tokenId,
      price,
      listingType,
      decreaseTime,
      decreasePercentage,
      minPrice,
      maxPrice
    )

    if (chainId === 10) {
      console.log('listToken() tx receipt: ', listToken_)
      console.log(
        'Optimistic Ethereum txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + listToken_.hash
      )
    }
    if (chainId === 69) {
      console.log('listToken() tx receipt: ', listToken_)
      console.log(
        'Optimistic Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + listToken_.hash
      )
    }

    return listToken_
  } catch (error: any) {
    if (error.data?.message) {
      console.log('listToken call error.data.message: ', error.data.message)
      return error.data.message
    }

    if (error.message) {
      console.log('listToken call error.message: ', error.message)
      return error.message
    }
  }
}


export async function delistToken(
  // contract variables
  collectionAddress: string,
  tokenId: BigNumber,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    delistToken_

  if (chainId === 10) ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  else if (chainId === 69) ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  const seller: Signer = library.getSigner(account)

  try {
    delistToken_ = await marketplace.connect(seller).delistToken(
      collectionAddress,
      tokenId
    )

    if (chainId === 10) {
      console.log('delistToken() tx receipt: ', delistToken_)
      console.log(
        'Optimistic Ethereum txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + delistToken_.hash
      )
    }

    if (chainId === 69) {
      console.log('delistToken() tx receipt: ', delistToken_)
      console.log(
        'Optimistic Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + delistToken_.hash
      )
    }

    return delistToken_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}


export async function purchaseListing(
  // contract variables
  collectionAddress: string,
  tokenId: BigNumber,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    purchaseListing_

  if (chainId === 10) ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  else if (chainId === 69) ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  const buyer: Signer = library.getSigner(account)

  try {
    purchaseListing_ = await marketplace.connect(buyer).purchaseListing(
      collectionAddress,
      tokenId
    )

    if (chainId === 10) {
      console.log('purchaseListing() tx receipt: ', purchaseListing_)
      console.log(
        'Optimistic Ethereum txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + purchaseListing_.hash
      )
    }
    if (chainId === 69) {
      console.log('purchaseListing() tx receipt: ', purchaseListing_)
      console.log(
        'Optimistic Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + purchaseListing_.hash
      )
    }

    return purchaseListing_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}


/**
 * @dev Creates an offer for a certain token, it does not check if it's listed
 *      Escrowed bid, meaning bidder weth is transferred to marketplace contract
 * @notice it needs weth approval for the token's price
 * @param _ca collection's address
 * @param _tokenId the token that it bids for
 * @param _price the price that it wants to bid for this token
 * @param _expirationOption expiration time for this offer
 */
export async function escrowedBid(
  // contract variables
  collectionAddress: string,
  tokenId: BigNumber,
  newPrice: BigNumber,
  expirationOption: string,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    escrowedBid_

  if (chainId === 10) ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  else if (chainId === 69) ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  const bidder: Signer = library.getSigner(account)

  try {
    escrowedBid_ = await marketplace.connect(bidder).escrowedBid(
      collectionAddress,
      tokenId,
      newPrice,
      expirationOption
    )

    if (chainId === 10) {
      console.log('escrowedBid() tx receipt: ', escrowedBid_)
      console.log(
        'Optimistic Ethereum txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + escrowedBid_.hash
      )
    }
    if (chainId === 69) {
      console.log('escrowedBid() tx receipt: ', escrowedBid_)
      console.log(
        'Optimistic Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + escrowedBid_.hash
      )
    }

    return escrowedBid_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}


/** 
 * @dev Searches for previous bid on a certain token.
 *      Deletes current offer. Then inputs new.
 *      Refunds or takes weth from user.
 *      Renews expiration time from the moment changeBid is executed.
 * @param _ca collection's address
 * @param _tokenId the token that it bids for
 * @param _newPrice the new price that user wants to adjust their bid for this token
 * @param _expirationOption expiration time for this offer
 */
export async function changeBid(
  // contract variables
  collectionAddress: string,
  tokenId: BigNumber,
  newPrice: BigNumber,
  expirationOption: string,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    changeBid_: any

  if (chainId === 10) ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  else if (chainId === 69) ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  const bidder: Signer = library.getSigner(account)

  try {
    changeBid_ = await marketplace.connect(bidder).changeBid(
      collectionAddress,
      tokenId,
      newPrice,
      expirationOption
    )

    if (chainId === 10) {
      console.log('changeBid() tx receipt: ', changeBid_)
      console.log(
        'Optimistic Ethereum txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + changeBid_.hash
      )
    }
    if (chainId === 69) {
      console.log('changeBid() tx receipt: ', changeBid_)
      console.log(
        'Optimistic Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + changeBid_.hash
      )
    }

    return changeBid_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}


export async function acceptBid(
  // contract variables
  collectionAddress: string,
  tokenId: BigNumber,
  price: BigNumber,
  from: string,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number,
  library: Web3Provider | undefined
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    acceptBid_: any

  if (chainId === 10) ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  else if (chainId === 69) ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  const buyer: any = library?.getSigner(account)

  try {
    acceptBid_ = await marketplace.connect(buyer).acceptBid(
      collectionAddress,
      tokenId,
      price,
      from
    )

    if (chainId === 10) {
      console.log('acceptBid() tx receipt: ', acceptBid_)
      console.log(
        'Optimistic Ethereum txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + acceptBid_.hash
      )
    }

    if (chainId === 69) {
      console.log('acceptBid() tx receipt: ', acceptBid_)
      console.log(
        'Optimistic Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + acceptBid_.hash
      )
    }

    return acceptBid_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}


/**
  * @dev Deletes a bid. If it's escrowed then the weth is transferred back 
  *         to the bidder
  */
export async function cancelBid(
  // contract variables
  contractAddress: string,
  tokenId: BigNumber,
  price: BigNumber,
  // Web3 user variables
  account: string,
  chainId: number,
  library: Web3Provider
) {
  if (account == null || account === undefined) {
    return Error('Account not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    cancelBid_

  if (chainId === 10) ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
  else if (chainId === 69) ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  const buyer: Signer = library.getSigner(account)

  try {
    cancelBid_ = await marketplace.connect(buyer).cancelBid(
      contractAddress,
      tokenId,
      price
    )

    if (chainId === 10) {
      console.log('cancelBid() tx receipt: ', cancelBid_)
      console.log(
        'Optimistic Ethereum txn hash on Optimistic Etherscan: ',
        'https://optimistic.etherscan.io/tx/' + cancelBid_.hash
      )
    }

    if (chainId === 69) {
      console.log('cancelBid() tx receipt: ', cancelBid_)
      console.log(
        'Optimistic Kovan txn hash on Optimistic Etherscan: ',
        'https://kovan-optimistic.etherscan.io/tx/' + cancelBid_.hash
      )
    }

    return cancelBid_
  } catch (error: any) {
    if (error.data?.message) {
      return error.data.message
    }

    if (error.message) {
      return error.message
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// PUBLIC FUNCTIONS (ANONYMOUS)

export async function isListed(
  // contract variables
  collectionAddress: string,
  tokenId: BigNumber,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number
) {
  if (collectionAddress === undefined) {
    return Error('Collection address not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    isListed_,
    library

  // READ ONLY functions, when no wallet connected, set chainId to Optimism Mainnet
  if (chainId === 10) {
    ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_MAINNET_INFURA_URL)
  }

  if (chainId === 69) {
    ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_KOVAN_RPC_URL)
  }

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  isListed_ = await marketplace.connect(library).isListed(
    collectionAddress,
    tokenId
  )

  return isListed_
}

export async function getCurrentListing(
  // contract variables
  collectionAddress: string,
  tokenId: BigNumber,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number
) {
  if (collectionAddress === undefined) {
    return Error('Collection address not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    getCurrentListing_,
    library

  // READ ONLY functions, when no wallet connected, set chainId to Optimism Mainnet
  if (chainId === 10) {
    ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_MAINNET_INFURA_URL)
  }

  if (chainId === 69) {
    ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_KOVAN_INFURA_URL)
  }

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  getCurrentListing_ = await marketplace.connect(library).getCurrentListing(
    collectionAddress,
    tokenId
  )

  console.log(
    'GetCurrentListing contract call in `marketplace.tsx`: ',
    getCurrentListing_
  )

  return getCurrentListing_
}

export async function getCurrentListingPrice(
  // contract variables
  collectionAddress: string,
  tokenId: BigNumber,
  // Web3 user variables
  chainId: number
) {
  if (collectionAddress === undefined) {
    return initZero
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    getCurrentListingPrice_,
    library

  // READ ONLY functions, when no wallet connected, set chainId to Optimism Mainnet
  if (chainId === 10) {
    ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_MAINNET_INFURA_URL)
  }
  if (chainId === 69) {
    ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_KOVAN_INFURA_URL)
  }

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  getCurrentListingPrice_ = await marketplace.connect(library).getCurrentListingPrice(
    collectionAddress,
    tokenId
  )

  return getCurrentListingPrice_
}


export async function getOffers(
  // contract variables
  contractAddress: string,
  tokenId: BigNumber,
  // Web3 user variables
  account: string | null | undefined,
  chainId: number
) {
  if (contractAddress === undefined) {
    return Error('Collection address not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    getOffers_: OfferStructOutput[],
    library

  // READ ONLY functions, when no wallet connected, set chainId to Optimism Mainnet
  if (chainId === 10) {
    ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_MAINNET_INFURA_URL)
  }

  if (chainId === 69) {
    ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_KOVAN_INFURA_URL)
  }

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  getOffers_ = await marketplace.connect(library).getOffers(
    contractAddress,
    tokenId
  )

  return getOffers_
}


/**
  * @dev Gets listed tokens of a specific collection
  * @param _ca collection's address
  * @return an array of token ids that are listed into marketplace
  */
export async function getActiveListings(
  // contract variables
  collectionAddress: string,
  // Web3 user variables
  chainId: number
) {
  if (collectionAddress === undefined) {
    console.log("collectionAddress undefined")
    return []
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    getActiveListings_,
    library

  // READ ONLY functions, when no wallet connected, set chainId to Optimism Mainnet
  if (chainId === 10) {
    ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_MAINNET_INFURA_URL)
  }

  if (chainId === 69) {
    ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_KOVAN_INFURA_URL)
  }

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  getActiveListings_ = await marketplace.connect(library).getActiveListings(
    collectionAddress
  )

  return getActiveListings_
}


/**
 * @notice Gets user's nfts for a specific collection.
 *         The collection needs to support ERC721Enumerable or have 
 *         totalSupply() method
 * @param _ca collection's address
 * @param _owner owner's address
 * @return an array of token ids that the user has
 */
export async function getUserNFTs(
  // contract variables
  collectionAddress: string,
  account: string,
  // Web3 user variables
  chainId: number
) {
  if (collectionAddress === undefined) return []


  let marketplace: Marketplace,
    ctcAddress: string = '',
    getUserNFTs_,
    library

  // READ ONLY functions, when no wallet connected, set chainId to Optimism Mainnet
  if (chainId === 10) {
    ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_MAINNET_INFURA_URL)
  }

  if (chainId === 69) {
    ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_KOVAN_INFURA_URL)
  }

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  getUserNFTs_ = await marketplace.connect(library).getUserNFTs(
    collectionAddress,
    account
  )

  console.log(
    'GetUserNFTs contract call in `marketplace.tsx`: ',
    getUserNFTs_
  )

  return getUserNFTs_
}

/**
 * @notice Getter retrieving a user's escrowed amount in the Marketplace
 * @param _user user address
 * @return A uint256 representing the amount of WETH
 */
export async function checkEscrowAmount(
  // contract variables
  userAddress: string | null | undefined,
  // Web3 user variables
  chainId: number
) {
  if (userAddress === undefined || userAddress == null) {
    return Error('userAddress not found!')
  }

  let marketplace: Marketplace,
    ctcAddress: string = '',
    checkEscrowAmount_,
    library

  // READ ONLY functions, when no wallet connected, set chainId to Optimism Mainnet
  if (chainId === 10) {
    ctcAddress = OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_MAINNET_INFURA_URL)
  }

  if (chainId === 69) {
    ctcAddress = OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS
    library = new ethers.providers.JsonRpcProvider(OPTIMISM_KOVAN_INFURA_URL)
  }

  marketplace = new ethers.Contract(
    ctcAddress,
    MarketPlace__Artifact.abi
  ) as Marketplace

  checkEscrowAmount_ = await marketplace.connect(library).checkEscrowAmount(
    userAddress
  )

  return checkEscrowAmount_
}

