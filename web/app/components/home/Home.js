import React, { useContext, useEffect } from "react"
import StateContext from "../../StateContext"
import UserHome from "./UserHome"
import AdminHome from "./AdminHome"
import Page from "../Page"
import Header from "../header/Header"

function Home() {
  const appStatus = useContext(StateContext)
  return (
    <>
      <Header />
      <Page title="Home" wide={true}>
        {appStatus.user.usertype == "user" ? <UserHome /> : <AdminHome />}
      </Page>
    </>
  )
}

export default Home
