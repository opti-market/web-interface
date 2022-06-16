import {ApolloClient, InMemoryCache} from '@apollo/client'

const SUBGRAPH_API_URL = 'https://api.thegraph.com/subgraphs/name/0xwontonsoup/optimarket-subgraph-v1'

export const initLastID = "0"

export const apolloClient = new ApolloClient({
  uri: SUBGRAPH_API_URL,
  cache: new InMemoryCache(),
})

/***********
 * Queries *
 **********/
/**
 * @todo figure out why the below style of query throws an error
 */
// export const queryTokenPurchaseds = `
//   query($lastID: String) {
//     tokenPurchaseds(first: 1000, where: { id_gt: $lastID} }) {
//       id
//       _oldOwner
//       _newOwner
//       _price
//       _collection
//       _tokenId
//     }
//   }
// `

/*****************************
 * Queries across all tokens *
 ****************************/
export const queryTokenPurchaseds = `
  query {
    tokenPurchaseds(first: 1000) {
      id
      _oldOwner
      _newOwner
      _price
      _collection
      _tokenId
      _timestamp
      _txHash
    }
  }
`

export const queryTokenListeds = (lastID: string) => {
  const query = `query($lastID: String) {
    tokenListeds(first: 1000, where: { id_gt: ${ lastID } }) {
      id
      _token
      _tokenId
      _price
      _timestamp
    } 
  }`

  return query
}

// export const queryTokenDelisteds = `
//   query($lastID: String) {
//     tokenDelisteds(first: 1000, where: { id_gt: $lastID}) {
//       id
//       _token
//       _timestamp
//     }
//   }
// `

export const queryTokenDelisteds = `
  query {
    tokenDelisteds(first: 1000) {
      id
      _token
      _timestamp
      _txHash
    }
  }
`

/************************************
 * Queries across entire collection *
 ***********************************/
export const queryTokenListedsForCollection = (
  lastID: string,
  collectionAddress: string
) => {
  const query = `query($lastID: String) {
    tokenListeds(first: 1000, where: { id_gt: ${ lastID }, _token: "${ collectionAddress }" }) {
      id
      _token
      _tokenId
      _price
      _timestamp
    } 
  }`

  return query
}

export const queryTokenDelistedsForCollection = (
  lastID: string,
  collectionAddress: string
) => {
  const query = `query($lastID: String) {
    tokenDelisteds(first: 1000, where: { id_gt: ${ lastID }, _token: "${ collectionAddress }" }) {
      id
      _token
      _tokenId
      _timestamp
      _blockNumber
      _txHash
    } 
  }`

  return query
}

export const queryTokenPurchasedsForCollection = (
  lastID: string,
  collectionAddress: string
) => {
  const query = `query($lastID: String) {
    tokenPurchaseds(first: 1000, where: { id_gt: ${ lastID }, _collection: "${ collectionAddress }" }) {
      id
      _oldOwner
      _newOwner
      _price
      _collection
      _tokenId
      _timestamp
      _txHash
    } 
  }`

  return query
}

/*********************************
 * Queries for a single token id *
 ********************************/
export const queryTokenPurchasedsForTokenID = (tokenId) => {
  const query = `query {
    tokenPurchaseds(where: { _tokenId: ${ tokenId } }) {
      id
      _oldOwner
      _newOwner
      _price
      _collection
      _tokenId
      _timestamp
      _txHash
    }
  }`

  return query
}

export const queryTokenListedsForTokenID = (tokenId) => {
  const query = `query {
    tokenListeds(where: { _tokenId: ${ tokenId } }) {
      id
      _token
      _tokenId
      _price
      _timestamp
      _txHash
    }
  }`

  return query
}

export const queryTokenDelistedsForTokenID = (tokenId) => {
  const query = `query {
    tokenDelisteds(where: { _tokenId: ${ tokenId } }) {
      id
      _token
      _tokenId
      _timestamp
      _txHash
    }
  }`

  return query
}


/*********************
 * Utility functions *
 ********************/
export type TokenListed = {
  id: string // see OptiMarket subgraph for details on this parameter
  __typename: string // event name, e.g. "TokenListed"
  _price: string // as a BigNumber, e.g. "10000000000000000000"
  _timestamp: string // e.g. "1644924334"
  _token: string // collection address
  _tokenId: string // e.g. "51"
}

/**
 * @dev Time complexity of this function is 0(3n^2) or just 0(n^2)
 * @param _eventObjArrays An array of 3 sub-arrays 
 * @returns filteredTokenListeds: any[]
 */
export const crossCheckAndFilter = (_eventObjArrays: any[][]) => {
  let filteredTokenListeds,
    hashMap = {"-1": "-9999999"} // hashMap of tokenIds and their timestamps

  const tokenListedEvents: TokenListed[] = _eventObjArrays[0][0]
  const tokenDelistedEvents = _eventObjArrays[0][1]
  const tokenPurchasedEvents = _eventObjArrays[0][2]

  /**
   * @dev Remove duplicate `TokenListed` events by taking the event with the 
   *      greater timestamp.
   */
  for (let i = 0; i < tokenListedEvents?.length; i++) {
    const tlObj: TokenListed = tokenListedEvents[i]

    if (!hashMap[tlObj._tokenId]) {
      hashMap[tlObj._tokenId] = {}
      hashMap[tlObj._tokenId]._timestamp = tlObj._timestamp
      hashMap[tlObj._tokenId]._tokenId = tlObj._tokenId
      // console.log('HashMap: ', hashMap)
    } else {
      if (hashMap[tlObj._tokenId]._timestamp < tlObj._timestamp) {
        filteredTokenListeds = tokenListedEvents.filter(
          (obj: any) => obj._tokenId !== hashMap[tlObj._tokenId]._tokenId
        )
      }
    }
  }

  /**
   * @dev  2. Cross check `TokenListed` with `TokenPurchased` events and remove
   *          any TokenListed events that have timestamps that come before the
   *          TokenPurchased event
   * 
   * Time complexity:  0(n^2)
   */
  for (let i = 0; i < tokenListedEvents?.length; i++) {
    const tlObj = tokenListedEvents[i]

    for (let j = 0; j < tokenPurchasedEvents?.length; j++) {
      const tpObj = tokenPurchasedEvents[j]

      if (
        parseInt(tlObj._tokenId) === parseInt(tpObj._tokenId) &&
        tlObj._timestamp.toString() < tpObj._timestamp.toString()
      ) {
        filteredTokenListeds = tokenListedEvents.filter(
          (obj: any) => obj._tokenId !== tlObj._tokenId
        )
      }
    }
  }

  /**
   * @dev  3. Cross check TokenListed against TokenDelisted events and remove
   *          any TokenListed events that have timestamps that come before the
   *          TokenDelisted event.
   * 
   * Time complexity:  0(n^2)
   */
  for (let i = 0; i < tokenListedEvents?.length; i++) {
    const tlObj = tokenListedEvents[i]

    for (let j = 0; j < tokenDelistedEvents?.length; j++) {
      const tdObj = tokenDelistedEvents[j]

      if (
        parseInt(tlObj._tokenId) === parseInt(tdObj._tokenId) &&
        tlObj._timestamp.toString() < tdObj._timestamp.toString()
      ) {
        filteredTokenListeds = tokenListedEvents.filter(
          (obj: any) => obj._tokenId !== tlObj._tokenId
        )
      }
    }
  }

  return filteredTokenListeds
}