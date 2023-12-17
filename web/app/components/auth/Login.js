import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DispachContext from "../../DispachContext"

function Login() {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const appDispach = useContext(DispachContext)
  async function handilSumbit(e) {
    e.preventDefault()
    try {
      const responce = await axios.post("/login", { username, password })
      // console.log(responce.data.user)
      const itemList = await axios.get("/product-list")
      // console.log(itemList.data.data)
      let msg = `Welcome ${responce.data.user.fullname}`
      appDispach({ type: "login", data: responce.data.user, items: itemList.data.data })
      appDispach({ type: "flashMessage", value: msg })
    } catch (error) {
      console.log("error" + error)
    }
  }
  return (
    <>
      <div className="log-in-div">
        <div className="wrapper ">
          <form onSubmit={handilSumbit}>
            <h1>Login</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
              <i className="bx bxs-lock-alt"></i>
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot password</a>
            </div>

            <button type="submit" className="btn">
              Login
            </button>

            <div className="register-link">
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
