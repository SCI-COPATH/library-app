import React, { useContext, useEffect } from "react"
import StateContext from "../../StateContext"

function AdminHome() {
  const appState = useContext(StateContext)
  return (
    <>
      <h3>Hello {appState.user.username} 👋</h3>
      <div className="d-flex justify-content-between">
        <div className="p-2 m-2 w-50">
          <h5>Update Product Status </h5>
          <div>
            <a className="icon-a icon-a-hover fw-semibold" href="/InsertBook">
              <i className="fa-solid fa-book"></i>
              Add New Book
            </a>
          </div>

          {/* <div>
            <a className="icon-a icon-a-hover fw-semibold" href="/admin/update-stock">
              <i className="fa-solid fa-pencil" aria-hidden="true"></i>
              Update stocks
            </a>
          </div>
          <div>
            <a className="icon-a icon-a-hover fw-semibold" href="/admin/add-admin">
              <i className="fa-solid fa-user-plus" aria-hidden="true"></i>
              Add Admin
            </a>
          </div>
          <div>
            <a className="icon-a icon-a-hover fw-semibold" href="admin/remove-admin">
              <i className="fa-solid fa-user-minus" aria-hidden="true"></i>
              Remove Admin
            </a>
          </div> */}
        </div>
        <div className="p-2 m-2 w-100">
          <h5>Customer status</h5>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus porro fugit adipisci corrupti accusantium ut in iste saepe optio dolorem dolore laborum, minus sed quae animi doloremque ducimus! Eligendi, quam!</p>
        </div>
      </div>
    </>
  )
}

export default AdminHome
