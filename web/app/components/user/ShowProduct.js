import React, { useContext, useEffect } from "react"
import StateContext from "../../StateContext"

function ShowProduct(props) {
  const appStatus = useContext(StateContext)
  let current = props.select == "All" ? appStatus.items : appStatus.items.filter((x) => x.catagory == props.select)
  console.log(current)
  function handileBuy(){
    
  }
  return (
    <>
      <div className="row justify-content-between">
        {current.map((x) => {
          return (
            <>
              <div className="container m-4 " style={{ maxWidth: "max-content" }}>
                <div className="card border-0 rounded-0 shadow" style={{ width: "18rem", maxWidth: "18rem" }}>
                  <img src={`http://localhost:8080/images/items/${x.imgae}`} className="card-img-top rounded-0" alt="..." />
                  <div className="card-body mt-3 mb-3">
                    <div className="row">
                      <div className="col-10">
                        <h4 className="card-title">{x.name}</h4>
                        {x.edition}
                      </div>
                      <div className="col-2">
                        <i className="bi bi-bookmark-plus fs-2"></i>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center text-center g-0">
                    <div className="col-4">
                      <h5>{x.rate} Rs</h5>
                    </div>
                    <div className="col-8">
                      <a href="#" className="btn btn-dark w-100 p-3 rounded-0 text-warning" onClick={handileBuy(x.id)}>
                        BUY NOW
                      </a>
                    </div>
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
