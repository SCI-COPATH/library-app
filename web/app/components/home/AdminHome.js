import React, { useContext, useEffect, useState } from "react"
import StateContext from "../../StateContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import DispachContext from "../../DispachContext"

function AdminHome() {
  const appState = useContext(StateContext)
  const appDispach = useContext(DispachContext)
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [id, setId] = useState()

  const numordmonth = appState.order.filter((order) => {
    let orderDate = new Date(Date.parse(order.date))
    let todayDate = new Date()
    return orderDate.getMonth() == todayDate.getMonth() && orderDate.getFullYear() == todayDate.getFullYear()
  }).length
  const numordday = appState.order.filter((order) => {
    let orderDate = new Date(Date.parse(order.date))
    let todayDate = new Date()

    return orderDate.getDate() == todayDate.getDate() && orderDate.getMonth() == todayDate.getMonth() && orderDate.getFullYear() == todayDate.getFullYear()
  }).length
  const alertItem = appState.items.filter((item) => item.qty <= 50)
  // console.log(alertItem)

  async function handilSubmit(e) {
    e.preventDefault()
    // console.log(id)
    try {
      const item = appState.items.filter((item) => item.id == id)

      let newQty = parseInt(item[0].qty) + parseInt(qty)
      // console.log(newQty)
      let msg = `Add ${newQty} stoke in ${item[0].name} Book Sucessfully`
      const responce = await axios.post("/update-items-qty", { id, qty: newQty })
      console.log(responce.data.message)
      const itemList = await axios.get("/product-list")

      appDispach({ type: "update-product-list", items: itemList.data.data })
      appDispach({ type: "flashMessage", value: msg })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <h3>Hello {appState.user.name} 👋</h3>
      <div className="d-flex justify-content-between">
        <div className="p-2 m-2 w-50">
          <h4>Update Product Status </h4>
          <div>
            <a className="icon-a icon-a-hover fw-semibold" href="/InsertBook">
              <i className="fa-solid fa-book"></i>
              Add New Book
            </a>
          </div>
        </div>
        <div className="p-2 m-2 w-100">
          <h4>Orders Update</h4>
          <div>Today's orders:{numordday}</div>
          <div>
            {new Date().toLocaleString("default", { month: "long" })}'s total order:{numordmonth}
          </div>
          {/* </div> */}
          {/* <div className="p-2 m-2 w-100"> */}
          <div className="row">
            {/* <div style={{ width: "max-content" }}> */}
            {alertItem.length > 0 ? <h4>Product Alert</h4> : ""}
            {alertItem.map((item) => {
              return (
                <div style={{ width: "max-content" }} className="pr-5 pb-5 ">
                  <form
                    // style={{ width: "max-content" }}
                    id={item.id}
                    onSubmit={(e) => {
                      e.preventDefault()
                      setId(e.target.id)
                    }}
                  >
                    <strong>{item.name}</strong>
                    <div className="text-danger">only {item.qty} stocks avalable</div>

                    <button type="submit" className="btn btn btn-danger" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + item.id.toString()}>
                      Add stock
                    </button>
                  </form>
                  <div className="modal fade" id={"staticBackdrop" + item.id.toString()} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                      <form onSubmit={handilSubmit} className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5" id="staticBackdropLabel">
                            {item.name}
                          </h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <div className="text-danger"> only {item.qty} stocks avalable</div>
                          <div className="d-flex">
                            <strong className="my-auto p-2">Quntaty </strong> <input onChange={(e) => setQty(e.target.value)} className="form-control text-center me-3" id="inputQuantity" type="number" min="1" defaultValue="1" style={{ maxWidth: "4rem" }} />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                          </button>
                          <button type="submit" className="btn btn btn-danger" data-bs-dismiss="modal" aria-label="Close">
                            Add stock
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )
            })}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminHome
