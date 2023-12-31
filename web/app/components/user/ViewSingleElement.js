import React, { useContext, useEffect, useState } from "react"

import Page from "../Page"
import Header from "../header/Header"
import StateContext from "../../StateContext"
import PlaceOrder from "./PlaceOrder"
import Product from "./Product"

function ViewSingleElement() {
  const appState = useContext(StateContext)
  // const [addressId, setAddressId] = useState()
  // const [selectAdd, setSelectAdd] = useState(false)

  let selected = appState.items.filter((x) => x.id == appState.select)[0]
  return (
    <>
      <Header />
      <Page title={selected.name} wide={true}>
        {appState.placeOrder.status ? <PlaceOrder /> : <Product />}
      </Page>
    </>
  )
}

export default ViewSingleElement
