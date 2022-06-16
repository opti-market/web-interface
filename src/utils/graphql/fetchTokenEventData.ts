import {gql} from '@apollo/client'
import {apolloClient} from './apolloClient'


/**
 * @dev _f_etch _t_oken _e_vent _d_ata (fted) for a single query.
 * @notice Generally, this function should be used with the `startEmptyLastID`
 *         variable
 * @param _setterForEventData Changes the state of this setter's state var
 * @param _setterForTernary Changes the state of this setter's state var 
 * @param _query The GraphQL query to be run
 */
export const ftedFromSingleQuery = (
  _setterForTernary: any,
  _queryNameInCamelCase: string,
  _query: any,
  _tokenId: number,
) => {
  apolloClient.query({
    query: gql(_query(_tokenId)),
    variables: {
      _tokenId
    },
  }).then((responseJson: any) => {
    let eventData = responseJson?.data
    eventData = eventData[_queryNameInCamelCase]

    if (eventData !== undefined) _setterForTernary(eventData)
  })
}


/**
 * @dev _f_etch _t_oken _e_vent _d_ata (fted) for multiple queries.
 * @param _setterForEventData Changes the state of this setter's state var
 * @param _setterForTernary Changes the state of this setter's state var 
 * @param _query The GraphQL query to be run
 */
export const ftedFromMultipleQueries = (
  _setterForEventData: any,
  _queryNameInCamelCase: string[],
  _queries: any[],
  _tokenId: number
) => {
  let dataFromQueries: any = []

  for (let i = 0; i < _queries.length; i++) {
    const query = _queries[i](_tokenId)

    apolloClient.query({
      query: gql(query),
      variables: {
        _tokenId
      },
    }).then((responseJson: any) => {
      const eventData = responseJson?.data

      if (eventData !== undefined) {
        dataFromQueries.push(eventData[_queryNameInCamelCase[i]])
      }
    })

    if (i === _queries.length - 1) _setterForEventData(dataFromQueries)
  }
}