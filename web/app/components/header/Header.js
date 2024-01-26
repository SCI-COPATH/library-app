import React, { useContext, useEffect, useState } from "react"
import DispachContext from "../../DispachContext"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import StateContext from "../../StateContext"

function Header() {
  const navigater = useNavigate()
  const appDispach = useContext(DispachContext)
  const appState = useContext(StateContext)

  console.log(appState.user.usertype)
  function handilLogout() {
    appDispach({ type: "logout" })
    appDispach({ type: "flashMessage", value: "Logout Sucesfully" })
    navigater("/")
  }
  return (
    <>
      <nav className="navbar navbar-dark navbar-expand-sm bg-dark fixed-top" style={{ zIndex: 1 }}>
        <div className="container ">
          <Link to="/" className="navbar-brand">
            <i className="fa-solid fa-book-open-reader"></i> &nbsp; Book store
          </Link>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div id="navbarNavDropdown" className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav ml-auto">
              {appState.user.usertype == "user" ? (
                <li>
                  <li className="d-flex" role="search">
                    <input onChange={(e) => appDispach({ type: "search", value: e.target.value })} className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                  </li>
                </li>
              ) : (
                ""
              )}
              <li className="nav-item">
                <Link to="/" className="nav-link active">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/profile" className="nav-link active">
                  profile
                </Link>
              </li>
              <li className="nav-item">
                {appState.user.usertype == "user" ? (
                  <Link to="/order" className="nav-link active">
                    Orders
                  </Link>
                ) : (
                  <Link to="/update-status" className="nav-link active">
                    updates
                  </Link>
                )}
              </li>
              <li className="nav-item">
                <button className="nav-link active" onClick={handilLogout}>
                  Signout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
