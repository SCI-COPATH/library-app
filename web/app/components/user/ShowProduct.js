import React, { useContext, useEffect } from "react"
import StateContext from "../../StateContext"
import DispachContext from "../../DispachContext"
import { useNavigate } from "react-router-dom"

function ShowProduct(props) {
  const appStatus = useContext(StateContext)
  const appDispach = useContext(DispachContext)
  const nvatigate = useNavigate()
  let currentDEPT = props.select == "All" ? appStatus.items : appStatus.items.filter((x) => x.catagory == props.select)
  // console.log("strat")
  // console.log(currentDEPT)
  // console.log(props.auther)

  let current = props.auther == "All" ? currentDEPT : currentDEPT.filter((x) => x.auther == props.auther)
  // console.log(current)
  current = current.filter((x) => x.qty > 0)
  // console.log(current)
  // console.log("end")
  function handileBuy(e) {
    e.preventDefault()
    appDispach({ type: "reset-buy-status" })
    // console.log(appStatus.select)
    nvatigate("/view-product")
  }
  return (
    <>
      <div className="row justify-content-between">
        {current.map((x) => {
          return (
            <>
              <div className="container m-4 " style={{ maxWidth: "max-content" }} key={x.id}>
                <div className="card border-0 rounded-0 shadow" style={{ width: "18rem", maxWidth: "18rem" }}>
                  <img src={`http://localhost:8080/images/items/${x.image}`} className="card-img-top rounded-0" alt={x.name} />

                  <div className="card-body mt-3 mb-3">
                    <div className="row">
                      <div className="col-10">
                        <small>
                          by <span className="text-primary">{x.auther}</span>
                        </small>
                        <h4 className="card-title">{x.name}</h4>
                        {x.edition}
                      </div>
                      <div className="col-2">
                        <i className="bi bi-bookmark-plus fs-2"></i>
                      </div>
                      <strong className="text-danger"> {x.qty < 50 ? `Only ${x.qty} book left` : ""} </strong>
                    </div>
                  </div>
                  <div className="row align-items-center text-center g-0">
                    <div className="col-4">
                      <h5>{x.rate} Rs</h5>
                    </div>
                    <form className="col-8" onSubmit={handileBuy}>
                      <button className="btn btn-dark w-100 p-3 rounded-0 text-warning" id={x.id} type="submit" onClick={(e) => appDispach({ type: "set-select", select: e.target.id })}>
                        BUY NOW
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default ShowProduct
