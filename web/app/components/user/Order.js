import React, { useContext, useEffect, useState } from "react"
import Page from "../Page"
import Header from "../header/Header"
import StateContext from "../../StateContext"

function Order() {
  const appState = useContext(StateContext)

  // console.log(appState.order)
  // console.log(appState.items)
  // console.log("Start")
  // appState.order.map((oreder) => {
  //   console.log(appState.items.filter((item) => item.id == oreder.itemId))
  // })
  // appState.items.map((item) => {
  //   console.log(appState.order.filter((order) => order.itemId == item.id))
  // })
  // console.log("end")
  return (
    <>
      <Header />
      <Page title="My Orders" wide={true}>
        <h3>Orders</h3>
        <div className="row justify-content-between">
          {appState.order.map((order) => {
            let address = appState.address.filter((add) => add.id == order.address_id)[0]

            return (
              <>
                <div className="container m-4 " style={{ maxWidth: "max-content" }} key={order.id}>
                  <div className="card border-0 rounded-0 shadow " style={{ width: "18rem", maxWidth: "18rem" }}>
                    <img src={`http://localhost:8080/images/items/${appState.items.filter((item) => item.id == order.itemId)[0].image}`} className="card-img-top rounded-0" />
                    <div className="card-body mt-3 mb-3">
                      <div className="row">
                        <div className="col-10">
                          <h4 className="card-title">{appState.items.filter((item) => item.id == order.itemId)[0].name}</h4>
                          <div>
                            Order id:<strong>{order.id}</strong>
                          </div>
                          <div>
                            Date:<strong>{order.date.split("T")[0]}</strong>
                          </div>
                          <div>
                            Status:<strong>{order.status}</strong>
                          </div>
                          <div>
                            <div>
                              <strong>Address</strong>
                              <div>{address.name}</div>
                              <div>{address.line1}</div>
                              <div>{address.line2}</div>
                              <div>
                                <span>{address.City}</span> <span>{address.pincode}</span>
                              </div>
                              <div>{address.phone_number}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-center text-center g-0">
                      <div className="col-6">
                        <h5>Qty: {order.qty}</h5>
                      </div>
                      <div className="col-6">
                        <h5>{appState.items.filter((item) => item.id == order.itemId)[0].rate * order.qty}/- Rs</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        </div>
      </Page>
    </>
  )
}

export default Order
