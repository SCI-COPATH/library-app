import React, { useEffect } from "react"

function Container(props) {
  return (
    <div style={{ paddingTop: "80px" }} className={"container md-5  " + (props.wide ? "" : "container--narrow")}>
      {props.children}
    </div>
  )
}

export default Container
