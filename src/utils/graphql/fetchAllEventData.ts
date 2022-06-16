import {gql} from '@apollo/client'
import {apolloClient} from './apolloClient'


/**
 * _f_etch _a_ll _d_ata _f_or _s_ingle _e_vent from single query
 * @param _setterForTernary 
 * @param _queryNameInCamelCase 
 * @param _query 
 */
export const fadfseFromSingleQuery = (
  _setterForTernary: any,
  _queryNameInCamelCase: string,
  _query: any,
  _lastID: string,
  _collectionAddress: string
) => {
  apolloClient.query({
    query: gql(_query(_lastID, _collectionAddress)),
    variables: {
      _lastID
    }
  }).then((responseJson: any) => {
    let eventData = responseJson?.data
    eventData = eventData[_queryNameInCamelCase]

    if (eventData !== undefined) _setterForTernary(eventData)
  })
}


/**
 * @dev _f_etch _a_ll _d_ata _f_or _m_ultiple _e_vents (fadfme) from multiple 
 *      queries.
 */
export const fadfmeFromMultipleQueries = async (
  _queryNameInCamelCase: string[],
  _queries: any[],
  _lastID: string,
  _collectionAddress: string
) => {
  let dataFromQueries: any = []

  for (let i = 0; i < _queries.length; i++) {
    const query = _queries[i](_lastID, _collectionAddress)
    const variables_ = {_lastID}
    const response = await apolloClient.query({
      query: gql(query),
      variables: variables_
    })
    const eventData = response.data

    if (eventData !== undefined) {
      dataFromQueries.push(eventData[_queryNameInCamelCase[i]])
    }

    if (i === _queries.length - 1) return dataFromQueries
  }
}