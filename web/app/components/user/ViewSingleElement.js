import React, { useContext, useEffect, useState } from "react"
import StateContext from "../../StateContext"
import Page from "../Page"
import Header from "../header/Header"
import axios from "axios"
import DispachContext from "../../DispachContext"
import { useNavigate } from "react-router-dom"

function ViewSingleElement() {
  const appState = useContext(StateContext)
  const appDispach = useContext(DispachContext)
  const [qty, setQty] = useState(1)
  const navigate = useNavigate()
  console.log(appState.select)
  let selected = appState.items.filter((x) => x.id == appState.select)[0]
  console.log(selected)
  async function handilSubmit(e) {
    e.preventDefault()
    try {
      let itemList = await axios.get("/product-list")
      // console.log(itemList.data.data)
      appDispach({ type: "update-product-list", items: itemList.data.data })
      selected = appState.items.filter((x) => x.id == appState.select)[0]
      if (selected.qty == 0) {
        appDispach({ type: "flashMessage", value: "Sorry item is out of stock" })
        navigate("/")
      }
      let newQty = selected.qty - qty
      await axios.post("/update-items-qty", { id: selected.id, qty: newQty })
      const order = axios.post("/place-order", { itemId: selected.id, qty, username: appState.user.username })
      itemList = await axios.get("/product-list")
      console.log(itemList.data.data)
      const orderList = await axios.post("/get-order", { username: appState.user.username })
      appDispach({ type: "update-product-list", items: itemList.data.data })
      appDispach({ type: "order", order: orderList.data.data })
      appDispach({ type: "flashMessage", value: "Order sucesfully compeleted" })
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Header />
      <Page title={selected.name} wide={true}>
        <section className="py-5">
          <div className="container px-4 px-lg-5 my-5">
            <div className="row gx-4 gx-lg-5 align-items-center">
              <div className="col-md-6">
                <img className="card-img-top mb-5 mb-md-0" src={`http://localhost:8080/images/items/${selected.image}`} alt={selected.name} />
              </div>
              <div className="col-md-6">
                <div className="small mb-1">
                  by <span className="text-primary">{selected.auther}</span>
                </div>

                <h1 className="display-5 fw-bolder">{selected.name}</h1>
                <div className="medium mb-1">Edition : {selected.edition}</div>
                <div className="fs-5 mb-5">
                  {/* <span className="text-decoration-line-through">$45.00</span> */}
                  <span>{selected.rate}/-Rs</span>
                </div>
                <p className="lead">{selected.discription}</p>
                <form className="d-flex" onSubmit={handilSubmit}>
                  <input onChange={(e) => setQty(e.target.value)} className="form-control text-center me-3" id="inputQuantity" type="number" min="1" max={selected.qty} defaultValue="1" style={{ maxWidth: "4rem" }} />
                  <button className="btn btn-outline-dark flex-shrink-0" type="submit">
                    <i className="bi-cart-fill me-1"></i>
                    Buy now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Page>
    </>
  )
}

export default ViewSingleElement
