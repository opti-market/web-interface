/* External imports */
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'

/* Internal imports */
import { whitelist } from '../../utils/utils'
// import { OptiPunks as OptiPunks__Type } from '../contract-apis/types/OptiPunks'
// import {
//   OptimisticBunnies as OptimisticBunnies__Type
// } from '../contract-apis/types/OptimisticBunnies'


/**
 * @todo `addresses` should could be stored on AWS or IPFS
 */
export default function getContracts(
  _chainId: number,
  _library: Web3Provider | undefined,
  _setter: any
) {
  let contracts: any[] = [],
    addy = '',
    abi: any,
    signer: ethers.providers.JsonRpcSigner | undefined,
    contract_: any

  whitelist.forEach(collectionObj => {
    if (_chainId === 69) addy = collectionObj.contractAddress__Kovan
    if (_chainId === 10) addy = collectionObj.contractAddress__Mainnet

    if (addy !== '') {
      abi = collectionObj.artifact.abi
      signer = _library?.getSigner(0)

      /**
       * @todo Automate check that the collection name matches a collection name
       *       in the whitelist
       */
      // if (collectionObj.name === 'OptiPunks') {
      contract_ = new ethers.Contract(addy, abi, signer) // as OptiPunks__Type
      contracts.push(contract_)
      // }
    }
  })

  // Return array of contract objects to make conditional contract calls on 
  // client.
  _setter(contracts)
}