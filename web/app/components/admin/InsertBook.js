import React, { useContext, useEffect, useState } from "react"
import Page from "../Page"

import axios from "axios"
import { useNavigate } from "react-router"
import StateContext from "../../StateContext"
import DispachContext from "../../DispachContext"

function InsertBook() {
  const appStatus = useContext(StateContext)
  const appDispach = useContext(DispachContext)
  const naviater = useNavigate()
  const [bookname, setbookname] = useState()
  const [edition, setEdition] = useState()
  const [category, setCatagory] = useState()
  const [Prize, setPrize] = useState()
  const [quntaty, setQuntaty] = useState()
  const [discription, setDiscription] = useState()
  const [image, setImage] = useState()
  const [auther, setAuther] = useState()
  async function handilSubmit(e) {
    e.preventDefault()
    try {
      // console.log(appStatus.user.token)

      const formData = new FormData()
      formData.append("image", image)
      formData.append("token", appStatus.user.token)
      formData.append("name", bookname)
      formData.append("catagory", category)
      formData.append("edition", edition)
      formData.append("qty", quntaty)
      formData.append("realRate", Prize)
      formData.append("discription", discription)
      formData.append("auther", auther)
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }

      const responce = await axios.post("/insertItems", formData, config)
      console.log(responce.data)
      console.log("start")
      appDispach({ type: "flashMessage", value: "Book Added Sucsfully" })
      naviater("/")
      console.log("end")
    } catch (error) {
      console.log("Error" + error)
      try {
        if (error.response.data == "Invalid Token" || error.response.data == "Unauthorized") {
          appDispach({ type: "logout" })
          naviater("/")
        }
      } catch (error) {
        console.log("Error")
      }
    }
  }
  return (
    <>
      <Page title="Add book" wide={true}>
        <div className="add-list-outer ">
          <div className="container-list">
            <div className="myform">
              <form onSubmit={handilSubmit}>
                <h2>ENTRY BOOK</h2>
                <input onChange={(e) => setbookname(e.target.value)} type="text" placeholder="Name" />
                <input onChange={(e) => setEdition(e.target.value)} type="text" placeholder="Edition" />
                <input onChange={(e) => setAuther(e.target.value)} type="text" placeholder="Auther" />
                <input onChange={(e) => setCatagory(e.target.value)} type="text" placeholder="Category" />
                <input onChange={(e) => setPrize(e.target.value)} type="number" placeholder="Prize" />
                <input onChange={(e) => setQuntaty(e.target.value)} type="number" placeholder="Quantity" />
                <label htmlFor="textarea">Discription:</label>
                <textarea onChange={(e) => setDiscription(e.target.value)} id="textarea" name="textarea" rows="3" cols="40"></textarea>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" />
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </Page>
    </>
  )
}

export default InsertBook
