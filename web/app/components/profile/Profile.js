import React, { useContext, useEffect, useState } from "react"
import Page from "../Page"
import Header from "../header/Header"
import StateContext from "../../StateContext"
import axios from "axios"
import DispachContext from "../../DispachContext"

function Profile() {
  const appState = useContext(StateContext)
  const appDispach = useContext(DispachContext)
  const [name, setName] = useState(appState.user.name)
  const [email, setEmail] = useState(appState.user.email)
  const [phone, setPhone] = useState(appState.user.phone)

  const [addressName, setAddressName] = useState()
  const [line1, setLine1] = useState()
  const [line2, setLine2] = useState()
  const [city, setCity] = useState()
  const [pincode, setPincode] = useState()
  const [addressPhone, setAddressPhone] = useState()
  const [addressID, setAddressID] = useState()
  async function updateUserData(e) {
    e.preventDefault()
    try {
      const req = await axios.post("/update-user-data", { name, email, phone, username: appState.user.username })
      console.log(req.data)
      appDispach({ type: "update-user-data", name: name, phone: phone, email: email })
      appDispach({ type: "flashMessage", value: "Update User sucessfully !!!" })
    } catch (error) {
      console.log(error)
    }
  }
  async function addAddress(e) {
    e.preventDefault()
    // name, line1, line2,username,City,pincode,phone_number
    try {
      const res = await axios.post("/insert-address", { name: addressName, line1, line2, username: appState.user.username, City: city, pincode, phone_number: addressPhone })
      const address = await axios.post("/get-address", { username: appState.user.username })
      appDispach({ type: "flashMessage", value: "Sucesfully add new Address" })
      appDispach({ type: "address", address: address.data.data })
      // console.log(appState.address)
    } catch (error) {
      console.log(error)
    }
  }
  function selectAddress(id) {
    let localAddress = appState.address.filter((add) => add.id == id)[0]
    // console.log(localAddress)
    // console.log(localAddress.name)
    setAddressName(localAddress.name)
    setLine1(localAddress.line1)
    setLine2(localAddress.line2)
    setCity(localAddress.City)
    setPincode(localAddress.pincode)
    setAddressPhone(localAddress.phone_number)
    setAddressID(id)
  }
  async function update_address(e) {
    e.preventDefault()
    try {
      const req = await axios.post("/update-address", { name: addressName, line1, line2, city, pincode, phone: addressPhone, id: addressID })
      const address = await axios.post("/get-address", { username: appState.user.username })
      appDispach({ type: "flashMessage", value: "Sucesfully Update address" })
      appDispach({ type: "address", address: address.data.data })
    } catch (error) {
      console.log("Error")
    }
  }
  return (
    <>
      <Header />
      <Page title="Profile" wide={true}>
        <h3>Personal Detilus</h3>
        <div>Name: {appState.user.name}</div>
        <div>email: {appState.user.email}</div>
        <div>phone: {appState.user.phone}</div>
        <button type="button" className="btn btn-dark my-2" data-bs-toggle="modal" data-bs-target="#persnalData">
          Edit Persanal Data
        </button>

        <div className="modal fade" id="persnalData" tabindex="-1" aria-labelledby="persnalDataLabel" aria-hidden="true">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={updateUserData}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="persnalDataLabel">
                  Edit Persanol Data
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="input-group flex-nowrap my-2">
                  <span className="input-group-text" id="addon-wrapping">
                    Name
                  </span>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} aria-label="Username" aria-describedby="addon-wrapping" />
                </div>
                <div className="input-group flex-nowrap my-2">
                  <span className="input-group-text" id="addon-wrapping">
                    Email
                  </span>
                  <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="email" aria-describedby="addon-wrapping" />
                </div>
                <div className="input-group flex-nowrap my-2">
                  <span className="input-group-text" id="addon-wrapping">
                    Phone
                  </span>
                  <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="phone" aria-describedby="addon-wrapping" />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="submit" className="btn btn-dark" data-bs-dismiss="modal">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {appState.address.length > 0 ? <h3>Address</h3> : ""}

        <div>
          {appState.address.map((x) => {
            return (
              <div key={x.id}>
                {/* <input type="radio" className="btn-check" name="options-base" autocomplete="off" id={x.id}  onClick={(e) => setAddress(e.target.id)} /> */}

                <label className="btn text-start" htmlFor={x.id}>
                  <div>
                    <strong>{x.name}</strong>
                    <div>{x.phone_number}</div>
                    <div>{x.line1}</div>
                    <div>{x.line2}</div>
                    <span>{x.City}</span> <span>{x.pincode}</span>
                  </div>
                  <input
                    type="button"
                    className="btn btn-dark my-3"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal2"
                    id={x.id}
                    onClick={(e) => {
                      selectAddress(e.target.id)
                    }}
                    value="Edit Address"
                  />
                </label>
              </div>
            )
          })}

          <div className="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModal2Label" aria-hidden="true">
            <div className="modal-dialog">
              <form className="modal-content" onSubmit={update_address}>
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModal2Label">
                    Update Address
                  </h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="name">
                      Name
                    </span>
                    <input onChange={(e) => setAddressName(e.target.value)} value={addressName} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="name" required />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="line1">
                      Address line 1
                    </span>
                    <input onChange={(e) => setLine1(e.target.value)} value={line1} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="line1" required />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="line2">
                      Address line 2
                    </span>
                    <input onChange={(e) => setLine2(e.target.value)} value={line2} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="line2" required />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="city">
                      city
                    </span>
                    <input onChange={(e) => setCity(e.target.value)} value={city} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="city" required />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="pincode">
                      Pin code
                    </span>
                    <input onChange={(e) => setPincode(e.target.value)} value={pincode} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="pincode" required />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="phone">
                      Phone
                    </span>
                    <input onChange={(e) => setAddressPhone(e.target.value)} value={addressPhone} type="tel" className="form-control" aria-label="Sizing example input" aria-describedby="phone" required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                    Update Address
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div>
            <button type="button" className="btn btn-dark my-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
              Add Address
            </button>
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <form className="modal-content" onSubmit={addAddress}>
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Add New Address
                    </h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="name">
                        Name
                      </span>
                      <input onChange={(e) => setAddressName(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="name" required />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="line1">
                        Address line 1
                      </span>
                      <input onChange={(e) => setLine1(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="line1" required />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="line2">
                        Address line 2
                      </span>
                      <input onChange={(e) => setLine2(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="line2" required />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="city">
                        city
                      </span>
                      <input onChange={(e) => setCity(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="city" required />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="pincode">
                        Pin code
                      </span>
                      <input onChange={(e) => setPincode(e.target.value)} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="pincode" required />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="phone">
                        Phone
                      </span>
                      <input onChange={(e) => setAddressPhone(e.target.value)} type="tel" className="form-control" aria-label="Sizing example input" aria-describedby="phone" required />
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  )
}

export default Profile
