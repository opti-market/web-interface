/* External imports */
import React, { useState, useEffect, useRef } from 'react'


type Props = {
  onBottomHit: () => void
  isLoading: boolean
  hasMoreDataAll: boolean
  hasMoreDataListed: boolean
  hasMoreDataFilter: boolean
  loadOnMount: boolean
  forSaleFilter: boolean
  typeFilters: boolean
  loadFilteredObjs: any
  loadListedObjs: any
  assetsByType: any
}

function isBottom(ref: React.RefObject<HTMLDivElement>) {
  if (!ref.current) {
    return false
  }

  return ref.current.getBoundingClientRect().bottom <= window.innerHeight
}

const InfiniteScroll: React.FC<Props> = ({
  onBottomHit,
  isLoading,
  hasMoreDataAll,
  hasMoreDataListed,
  hasMoreDataFilter,
  loadOnMount,
  forSaleFilter,
  typeFilters,
  loadFilteredObjs,
  loadListedObjs,
  assetsByType,
  children,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const [forSaleInitialLoad, setForSaleInitialLoad] = useState(true)


  useEffect(() => {
    if (loadOnMount && initialLoad) {
      onBottomHit()
      setInitialLoad(false)
    }
  }, [onBottomHit, loadOnMount, initialLoad])

  useEffect(() => {
    if ((forSaleFilter && !typeFilters) && forSaleInitialLoad) {
      onBottomHit()
      setForSaleInitialLoad(false)
    }
  }, [onBottomHit, forSaleFilter, forSaleInitialLoad])


  useEffect(() => {
    const onScroll = () => {
      if (
        !isLoading &&
        (!forSaleFilter && !typeFilters) &&
        hasMoreDataAll &&
        isBottom(contentRef)
      ) {
        onBottomHit()
      }

      if (
        !isLoading &&
        (forSaleFilter && !typeFilters) &&
        hasMoreDataListed &&
        isBottom(contentRef) &&
        (loadListedObjs.length > 0)
      ) {
        onBottomHit()
      }

      if (
        !isLoading &&
        (typeFilters) &&
        hasMoreDataFilter &&
        isBottom(contentRef) &&
        (loadFilteredObjs.length > 0)
      ) {
        onBottomHit()
      }
    }

    document.addEventListener('scroll', onScroll)

    return () => document.removeEventListener('scroll', onScroll)
  }, [onBottomHit, isLoading, hasMoreDataAll, hasMoreDataListed, hasMoreDataFilter])


  return (
    <div ref={contentRef}>
      {children}
    </div>
  )
}


export default InfiniteScroll