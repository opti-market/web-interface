export const ETHEREUM_API_URL = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'

// alternative: https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD

export const getETHPriceInUSD = setTimeout(async () => {
  const response = await fetch(ETHEREUM_API_URL)
  const json: any = response.json()
  return json
}, 10000)
