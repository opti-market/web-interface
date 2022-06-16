import formatPriceToETH from "./formatETH"


export default function getTotalVolumeInETH(eventObjs: any[]): number {
  let totalVol: number = 0.0

  eventObjs.forEach((eventObj: any) => {
    if (eventObj !== undefined) totalVol += formatPriceToETH(eventObj)
  })

  return totalVol
}