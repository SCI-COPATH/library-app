import React, { useEffect, useReducer, useState } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import axios from "axios"
axios.defaults.baseURL = "http://localhost:8080"
import { useImmerReducer } from "use-immer"
// My Components

import FlashMessages from "./components/FlashMessages"

import StateContext from "./StateContext"
import DispachContext from "./DispachContext"
import Register from "./components/auth/Register"
import Home from "./components/home/Home"
import Login from "./components/auth/Login"
import InsertBook from "./components/admin/InsertBook"

function Main() {
  let tempItem
  try {
    tempItem = JSON.parse(localStorage.getItem("items"))
  } catch (error) {
    tempItem = ""
  }
  const initialStage = {
    loggedIn: Boolean(localStorage.getItem("token")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      avatar: localStorage.getItem("avatar"),
      usertype: localStorage.getItem("usertype"),
    },
    items: tempItem,
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        draft.items = action.items
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialStage)
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("token", state.user.token)
      localStorage.setItem("username", state.user.username)
      localStorage.setItem("avatar", state.user.avatar)
      localStorage.setItem("usertype", state.user.usertype)
      localStorage.setItem("items", JSON.stringify(state.items))
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      localStorage.removeItem("avatar")
      localStorage.removeItem("usertype")
      localStorage.removeItem("items")
    }
  }, [state.loggedIn])
  return (
    <StateContext.Provider value={state}>
      <DispachContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages flashMessages={state.flashMessages} />
          <Routes>
            <Route path="/" element={state.loggedIn ? <Home /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/InsertBook" element={<InsertBook />} />
          </Routes>
        </BrowserRouter>
      </DispachContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
