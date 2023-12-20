import React, { useContext, useEffect, useState } from "react"
import StateContext from "../../StateContext"
import ShowProduct from "../user/ShowProduct"

function UserHome() {
  const appState = useContext(StateContext)
  const [select, setSelect] = useState("All")
  const [selectAuther, setSelectauther] = useState("All")
  let catagores = appState.items.map((x) => x.catagory).filter((item, index) => appState.items.map((x) => x.catagory).indexOf(item) === index)
  let auther = appState.items.map((x) => x.auther).filter((item, index) => appState.items.map((x) => x.auther).indexOf(item) === index)
  console.log(catagores)
  return (
    <>
      <h3>Hello {appState.user.name} 👋</h3>
      <div className="btn-group dropend p-4 mr-4">
        <button type="button" className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Dept: {select}
        </button>
        <ul className="dropdown-menu">
          {catagores.map((x) => (
            <li
              key={x.index}
              className="dropdown-item"
              // id={x.id}
              onClick={(e) => {
                setSelect(e.target.innerText)
                // setID(e.target.id)
              }}
            >
              {x}
            </li>
          ))}

          <li
            key={-1}
            className="dropdown-item"
            // id={x.id}
            onClick={(e) => {
              setSelect(e.target.innerText)
              // setID(e.target.id)
            }}
          >
            All
          </li>
        </ul>
      </div>
      <div className="btn-group dropend p-4 ml-4">
        <button type="button" className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Auther: {selectAuther}
        </button>
        <ul className="dropdown-menu">
          {auther.map((x) => (
            <li
              key={x.index}
              className="dropdown-item"
              // id={x.id}
              onClick={(e) => {
                setSelectauther(e.target.innerText)
                // setID(e.target.id)
              }}
            >
              {x}
            </li>
          ))}

          <li
            key={-1}
            className="dropdown-item"
            // id={x.id}
            onClick={(e) => {
              setSelectauther(e.target.innerText)
              // setID(e.target.id)
            }}
          >
            All
          </li>
        </ul>
      </div>

      <ShowProduct select={select} auther={selectAuther} />
    </>
  )
}

export default UserHome
