import React, { useState } from "react"
import "./Tooltip.css"

const Tooltip = (props) => {
  let timeout

  const [active, setActive] = useState(false)

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true)
    }, props.delay || 400)
  }

  const hideTip = () => {
    clearInterval(timeout)
    setActive(false)
  }


  return (
    <div
      className="Tooltip-Wrapper"
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {props.children}
      {active && (
        <div className={`Tooltip-Tip ${ props.direction || "top" }`}>
          {/* Content */}
          {props.content1 && props.content2 && props.content3 && props.content4 ? (
            <>
              {props.content1}
              <br />
              {props.content2}
              <br />
              {props.content3}
              <br />
              {props.content4}
            </>
          ) : (
            <>
              {props.content1}
            </>
          )}
        </div>
      )}
    </div>
  )
}


export default Tooltip
