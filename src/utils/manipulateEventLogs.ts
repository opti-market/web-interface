export class SpliceEventData {
  /**
   * @dev Iterates through the data field for a `TokenPurchased` event log,
   *      creating and returning 2 splices of event data.
   * @param data Data field from event log.
   * @returns splicedData: An array of spliced strings from `data`
   */
  tokenPurchased(data: string) {
    let splicedData: string[] = [],
      splice = '',
      numNonZeroRepeats = 0,
      numZeroRepeats = 0,
      si: number[] = [], // si = startIndex
      setSI = false, // setSI = setStartIndex
      siCount = 0, // siCount = startIndexCount
      k = 2 // target number of repeats

    // Iterate through data string
    for (let i = 0; i < data.length; i++) {
      let prevChar = ''

      const currentChar = data[i]

      if (data[i - 1]) prevChar = data[i - 1]

      if (numNonZeroRepeats < k && currentChar !== '0' && prevChar !== '0') {
        numNonZeroRepeats += 1
      }

      // 3. If previous 3 chars are all === '0', then we set the starting index of
      //    where to start our first splice.
      if (numNonZeroRepeats === k && setSI === false) {
        // splicesi = i - k // set index to start the splice
        si.push(i - k) // set index to start the splice

        numNonZeroRepeats = 0

        if (siCount < 2) {
          siCount += 1
        }
        setSI = true
      }


      if (setSI && siCount > 0) {
        // 4. Do a similar process for the next substring, where instead of 
        // keeping track of '0's, we keep track of the count of _non-zeros_ up
        // until we see another '0'.
        if (numZeroRepeats < k && currentChar === '0' && prevChar === '0') {
          numZeroRepeats += 1
        }

        /**
         * @dev We only want to return 2 splices! 
         * @notice We set `siCount === 2` so that we can perform a splice on the 
         *         the second list of data-chars (i.e. chars that are NOT '0').
         *     
         * 5. At the index of the 2nd repeated '0', set this as the index of the 
         *    next substring to splice.
         * 
         */
        if (numZeroRepeats === k || siCount === 2) {
          if (siCount === 1) splice = data.slice(si[siCount - 1], i - k)
          if (siCount === 2) splice = data.slice(si[siCount - 1])

          splicedData.push(splice)

          // 6. repeat step 3 and 4 until complete
          numZeroRepeats = 0 // reset so that we can repeat steps 3 & 4
          numNonZeroRepeats = 0 // reset so that we can repeat steps 3 & 4
          setSI = false // reset so that we can repeat steps 3 & 4
        }
      }
    }

    return splicedData
  }
}