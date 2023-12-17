import axios from "axios"

import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import DispachContext from "../../DispachContext"
import { Link } from "react-router-dom"

function Register() {
  const [fullname, setFullname] = useState()
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [phone, setPhone] = useState()
  const [password, setPassword] = useState()
  const appDispach = useContext(DispachContext)
  const navigate = useNavigate()
  async function handilSubmit(e) {
    e.preventDefault()
    try {
      const responce = await axios.post("/register", { fullname, username, email, phone, password, usertype: "user" })
      console.log(responce.data.user)
      appDispach({ type: "login", data: responce.data.user })
      appDispach({ type: "flashMessage", value: "Your Account Secusfully Registerd " })
      navigate("/")
    } catch (error) {
      console.log("Register Server error" + error)
    }
  }
  return (
    <div className="sign-up-div">
      <div className="container-signup ">
        <h1 className="form-title">Registration</h1>
        <form onSubmit={handilSubmit}>
          <div className="main-user-info">
            <div className="user-input-box">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" placeholder="Enter Full Name" onChange={(e) => setFullname(e.target.value)} />
            </div>
            <div className="user-input-box">
              <label htmlFor="username">Username</label>
              <input type="text" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="user-input-box">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="user-input-box">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input type="text" placeholder="Enter Phone Number" onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="user-input-box" onChange={(e) => setPassword(e.target.value)}>
              <label htmlFor="password">Password</label>
              <input type="password" placeholder="Enter Password" />
            </div>
            {/* <div className="user-input-box">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" placeholder="Confirm Password" />
          </div> */}
          </div>
          <div className="register-link">
            <p className="text-light">
              I have an account ? <Link to="/">Login</Link>
            </p>
          </div>
          {/* <div className="gender-details-box">
          <span className="gender-title">Gender</span>
          <div className="gender-category">
            <input type="radio" name="gender" />
            <label htmlFor="male">Male</label>
            <input type="radio" name="gender" />
            <label htmlFor="female">Female</label>
            <input type="radio" name="gender" />
            <label htmlFor="other">Other</label>
          </div>
        </div> */}
          <div className="form-submit-btn">
            <input type="submit" value="Register" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
