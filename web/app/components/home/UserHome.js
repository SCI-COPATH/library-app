import React, { useContext, useEffect, useState } from "react"
import StateContext from "../../StateContext"
import ShowProduct from "../user/ShowProduct"

function UserHome() {
  const appState = useContext(StateContext)
  const [select, setSelect] = useState("All")
  let catagores = appState.items.map((x) => x.catagory).filter((item, index) => appState.items.map((x) => x.catagory).indexOf(item) === index)
  console.log(catagores)
  return (
    <>
      <div className="btn-group dropend">
        <button type="button" className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          filter {select}
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

      <ShowProduct select={select} />
    </>
  )
}

export default UserHome
