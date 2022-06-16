import {ethers} from "ethers"

export default function formatPriceToETH(eventObj: any): number {
  return parseFloat(
    parseFloat(
      ethers.utils.formatEther(
        eventObj._price
      )
    ).toFixed(3)
  )
}