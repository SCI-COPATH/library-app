import React, { useContext, useEffect, useState } from "react"
import Header from "../header/Header"
import Page from "../Page"
import StateContext from "../../StateContext"
import DispachContext from "../../DispachContext"

function UpdateStatus() {
  const appState = useContext(StateContext)
  const appDispach = useState(DispachContext)
  let order = appState.order.filter((ord) => ord.status != "Deleved")

  return (
    <>
      <Header />
      <Page title="Update status" wide={true}>
        <h3>Update Status</h3>
      </Page>
    </>
  )
}

export default UpdateStatus
