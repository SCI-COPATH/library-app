import React, { useContext, useEffect, useState } from "react"
import StateContext from "../../StateContext"
import DispachContext from "../../DispachContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function PlaceOrder() {
  const appState = useContext(StateContext)
  const appDispach = useContext(DispachContext)
  const navigate = useNavigate()
  const [address, setAddress] = useState(-1)
  async function handilSubmit(e) {
    e.preventDefault()
    if (address == -1) {
      appDispach({ type: "flashMessage", value: "Select any address" })
    } else {
      try {
        let itemList = await axios.get("/product-list")
        // console.log(itemList.data.data)
        appDispach({ type: "update-product-list", items: itemList.data.data })
        let selected = appState.items.filter((x) => x.id == appState.select)[0]
        if (selected.qty == 0) {
          appDispach({ type: "flashMessage", value: "Sorry item is out of stock" })
          navigate("/")
        }
        let newQty = selected.qty - appState.placeOrder.qty
        await axios.post("/update-items-qty", { id: selected.id, qty: newQty })
        const order = axios.post("/place-order", { itemId: selected.id, qty: appState.placeOrder.qty, username: appState.user.username, addressID: address })
        itemList = await axios.get("/product-list")
        // console.log(itemList.data.data)
        const orderList = await axios.post("/get-order", { username: appState.user.username })
        appDispach({ type: "update-product-list", items: itemList.data.data })
        appDispach({ type: "order", order: orderList.data.data })
        appDispach({ type: "flashMessage", value: "Order sucesfully compeleted" })
        let placeOrder = {
          qty: "",
          status: false,
        }
        appDispach({ type: "place-order", placeOrder: placeOrder })
        navigate("/")
      } catch (error) {
        console.log(error)
      }
    }
  }
  const [name, setname] = useState()
  const [line1, setLine1] = useState()
  const [line2, setLine2] = useState()
  const [city, setCity] = useState()
  const [pincode, setPincode] = useState()
  const [phone, setPhone] = useState()
  async function addAddress(e) {
    e.preventDefault()
    // name, line1, line2,username,City,pincode,phone_number
    try {
      const res = await axios.post("/insert-address", { name, line1, line2, username: appState.user.username, City: city, pincode, phone_number: phone })
      const address = await axios.post("/get-address", { username: appState.user.username })
      appDispach({ type: "flashMessage", value: "Sucesfully add new Address" })
      appDispach({ type: "address", address: address.data.data })
      console.log(appState.address)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <h3>Address</h3>
      <form onSubmit={addAddress}>
        {appState.address.map((x) => {
          return (
            <div key={x.id}>
              <input type="radio" className="btn-check" name="options-base" id={x.id} autocomplete="off" onClick={(e) => setAddress(e.target.id)} />
              <label className="btn text-start" htmlFor={x.id}>
                <div>
                  <strong>{x.name}</strong>
                  <div>{x.phone_number}</div>
                  <div>{x.line1}</div>
                  <div>{x.line2}</div>
                  <span>{x.City}</span> <span>{x.pincode}</span>
                </div>
              </label>
            </div>
          )
        })}
        <div>
          {/* <button type="submit" className="btn btn-dark my-3">
            Add Address
          </button> */}
          <button type="button" className="btn btn-dark my-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Add Address
          </button>
          <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Add New Address
                  </h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div class="input-group mb-3">
                    <span className="input-group-text" id="name">
                      Name
                    </span>
                    <input onChange={(e) => setname(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="name" required />
                  </div>
                  <div class="input-group mb-3">
                    <span className="input-group-text" id="line1">
                      Address line 1
                    </span>
                    <input onChange={(e) => setLine1(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="line1" required />
                  </div>
                  <div class="input-group mb-3">
                    <span className="input-group-text" id="line2">
                      Address line 2
                    </span>
                    <input onChange={(e) => setLine2(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="line2" required />
                  </div>
                  <div class="input-group mb-3">
                    <span className="input-group-text" id="city">
                      city
                    </span>
                    <input onChange={(e) => setCity(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="city" required />
                  </div>
                  <div class="input-group mb-3">
                    <span className="input-group-text" id="pincode">
                      Pin code
                    </span>
                    <input onChange={(e) => setPincode(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="pincode" required />
                  </div>
                  <div class="input-group mb-3">
                    <span className="input-group-text" id="phone">
                      Phone
                    </span>
                    <input onChange={(e) => setPhone(e.target.value)} type="tel" className="form-control" aria-label="Sizing example input" aria-describedby="phone" required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                    Add address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={handilSubmit}>
        <button type="submit" className="btn btn-dark">
          Order Now
        </button>
      </form>

      {/* <ul className="list-group">
        {appState.address.map((x) => {
          return (
            <li
              className="list-group-item"
              key={x.id}
              id={x.id}
              onClick={(e) => {
                setAddressId(x.id)
              }}
            >
              <strong>{x.name}</strong>
              <div>{x.phone_number}</div>
              <div>{x.line1}</div>
              <div>{x.line2}</div>
              <span>{x.City}</span> <span>{x.pincode}</span>
            </li>
          )
        })}
      </ul> */}
    </>
  )
}

export default PlaceOrder
