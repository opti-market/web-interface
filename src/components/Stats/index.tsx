import {GlowCard} from "../AssetDetails"

/**
 * @todo Figure out where to put this 
 */
const Stats = ({totalVolumeInETH}: any) => {

  return (
    <>
      {totalVolumeInETH ? (
        <>
          {console.log('Total volume in eth: ', totalVolumeInETH)}
          <GlowCard style={{margin: '10px 0px 10px 0px'}}>
            {`Total Vol: ${ totalVolumeInETH } ETH`}
          </GlowCard>
        </>
      ) : (
        <>
          <GlowCard style={{margin: '10px 0px 10px 0px'}}>
            {`Total Vol: 0 ETH`}
          </GlowCard>
        </>
      )}
    </>
  )
}


export default Stats