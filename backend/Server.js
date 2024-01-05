const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")

const db = require("./db/connection.js")
const md5 = require("md5")
const user_secret_key = "user446sec4hkas"
const admin_secret_key = "ad544anjhbyuwas"

const app = express()
const port = 8080
app.use(express.json())
app.use(cors())
app.use(express.static("public"))

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true)
  } else {
    callback(null, Error("only image is allowd"))
  }
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/items")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  fileFilter: isImage,
})
//Authentication Middleware using JWT
const userAuthenticate = (req, res, next) => {
  const token = req.header("Authorization")
  console.log("Unextracted Token: " + token)

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const extractedToken = token.split(" ")[1]
  console.log("Actual TOken: " + extractedToken)

  try {
    // /verift and validate our token
    const decoded = jwt.verify(extractedToken, user_secret_key)
    req.userId = decoded.userId
    next()
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" })
  }
}

function authantication(token, key, req) {
  if (!token) {
    return { message: "Unauthorized" }
  }
  const extractedToken = token
  // console.log("Actual TOken: " + extractedToken)

  try {
    // /verift and validate our token
    const decoded = jwt.verify(extractedToken, key)
    req.userId = decoded.userId
  } catch (err) {
    return { message: "Invalid Token" }
  }
  return { message: "Sucess" }
}
app.post("/checkAuth", async (req, res) => {
  const { token, userId, userType } = req.body
  const responce = authantication(token, admin_secret_key, req)
  if (responce.message != "Sucess") {
    let keys = [user_secret_key, admin_secret_key]
    let key
    if (userType == "admin") {
      key = keys[1]
    } else {
      key = keys[0]
    }
    const token = jwt.sign({ userId: userId }, key, { expiresIn: "1h" })
    res.json({
      message: "Token Retake",
      status: true,
      user: {
        userName: userId,
        token: token,
        avatar: getAvatar(userId),
        userType: userType,
      },
    })
  } else {
    res.json({
      message: "token Expried",
      status: false,
      user: {
        userName: "",
        token: "",
        avatar: "",
        userType: "",
      },
    })
  }
})
app.get("/product-list", (req, res) => {
  const sql = "SELECT * FROM items"

  db.query(sql, [], (err, result) => {
    if (err) {
      console.log("Error Searching for userId: " + err)
      res.status(404).json({ message: "No username found" })
    } else {
      res.json({ message: "Sucess", data: result })
    }
  })
})
// app.get("/address", (req, res) => {
//   const { userId } = req.body
//   const sql = "SELECT * FROM address WHERE address.userId = ?"

//   db.query(sql, [userId], (err, result) => {
//     if (err) {
//       console.log("Error Searching for userId: " + err)
//       res.status(404).json({ message: "No username found" })
//     } else {
//       res.json({ message: "Sucess", data: result })
//     }
//   })
// })

app.post("/update-items-qty", async (req, res) => {
  const { id, qty } = req.body
  console.log(id)
  console.log(qty)
  const query = `UPDATE items SET qty= ? WHERE items.id= ?`
  console.log(query)
  db.query(query, [qty, id], async (err, resu) => {
    if (err) throw err
    res.json({ message: "Sucess" })
  })
})
app.post("/place-order", async (req, res) => {
  const { itemId, qty, username, addressID } = req.body

  console.log(username)
  console.log(qty)
  //Hash the Password

  const sql = "INSERT INTO orders (username, itemId,qty, status,address_id) VALUES (?, ? ,? , 'Not yet ship',?)"
  db.query(sql, [username, itemId, qty, addressID], (err, result) => {
    if (err) {
      console.log("Error In Registration: " + err)
    } else {
      res.json({ message: "sucess" })
    }
  })
})
app.post("/update-items", async (req, res) => {
  const { token, id, name, qty, mrp, rate, discription } = req.body
  // console.log(token)
  // console.log(id)
  // console.log(name)
  // console.log(mrp)
  // console.log(qty)
  // console.log(rate)
  // console.log(discription)
  const responce = authantication(token, admin_secret_key, req)
  console.log(responce.message)
  if (responce.message != "Sucess") {
    res.status(401).json(responce)
  }

  const query = `UPDATE items SET name= ?, qty= ?, mrp= ?, rate= ?, discription= ? WHERE items.id= ?`
  console.log(query)
  db.query(query, [name, qty, mrp, rate, discription, id], async (err, resu) => {
    if (err) throw err
    const sql = "SELECT * FROM items"

    db.query(sql, async (errr, result) => {
      if (err) throw errr
      res.json({ message: "Sucess", data: result })
    })
  })
})

app.get("/get-user-accounts", (req, res) => {
  // const { token } = req.body
  // const responce = authantication(token, admin_secret_key, req)
  // if (responce.message != "Sucess") {
  //   res.status(401).json(responce)
  // }
  const sql = "SELECT * FROM users"
  db.query(sql, (error, result) => {
    if (error) throw error
    res.json({ message: "Sucess", data: result })
  })
})
app.post("/get-order", (req, res) => {
  const { username } = req.body
  // console.log("inisde get order")
  // console.log(username)
  // const responce = authantication(token, admin_secret_key, req)
  // if (responce.message != "Sucess") {
  //   res.status(401).json(responce)
  // }
  const sql = "SELECT * FROM orders WHERE username=?"
  db.query(sql, [username], (error, result) => {
    if (error) throw error
    res.json({ message: "Sucess", data: result })
  })
})
app.post("/get-all-order", (req, res) => {
  // console.log("inisde get order")
  // console.log(username)
  // const responce = authantication(token, admin_secret_key, req)
  // if (responce.message != "Sucess") {
  //   res.status(401).json(responce)
  // }
  const sql = "SELECT * FROM orders "
  db.query(sql, (error, result) => {
    if (error) throw error
    res.json({ message: "Sucess", data: result })
  })
})
app.post("/insert-address", async (req, res) => {
  const { name, line1, line2, username, City, pincode, phone_number } = req.body
  const sql = "INSERT INTO address (name, line1, line2,username,City,pincode,phone_number) VALUES (?, ? ,? , ?,?,?,?)"
  db.query(sql, [name, line1, line2, username, City, pincode, phone_number], (err, result) => {
    if (err) {
      console.log("Error In Registration: " + err)
    } else {
      res.json({ message: "sucess" })
    }
  })
})
app.post("/get-address", (req, res) => {
  const { username } = req.body
  // console.log("inisde get order")
  // console.log(username)
  // const responce = authantication(token, admin_secret_key, req)
  // if (responce.message != "Sucess") {
  //   res.status(401).json(responce)
  // }
  const sql = "SELECT * FROM address WHERE username=?"
  db.query(sql, [username], (error, result) => {
    if (error) throw error
    res.json({ message: "Sucess", data: result })
  })
})
app.post("/update-address", async (req, res) => {
  const { name, line1, line2, city, pincode, phone, id } = req.body
  const query = `UPDATE address SET name = ?, line1 = ? , line2 = ?  ,City = ?,pincode = ? ,phone_number =?   WHERE address.id= ?`
  console.log(query)
  db.query(query, [name, line1, line2, city, pincode, phone, id], async (err, resu) => {
    if (err) throw err
    res.json({ message: "Sucess" })
  })
})

app.post("/update-user-type", async (req, res) => {
  const { token, id } = req.body
  console.log(token)
  console.log(id)
  const responce = authantication(token, admin_secret_key, req)
  if (responce.message != "Sucess") {
    res.status(401).json(responce)
  }
  sql = "UPDATE users SET userType='user' WHERE users.userId=? "
  db.query(sql, id, async (error, resu) => {
    if (error) throw error
  })
  res.json({ message: "Sucess" })
})
app.post("/update-admin-type", async (req, res) => {
  const { token, id } = req.body
  console.log(token)
  console.log(id)
  const responce = authantication(token, admin_secret_key, req)
  if (responce.message != "Sucess") {
    res.status(401).json(responce)
  }
  sql = "UPDATE users SET userType='admin' WHERE users.userId=? "
  db.query(sql, id, async (error, resu) => {
    if (error) throw error
  })
  res.json({ message: "Sucess" })
})
app.post("/insertItems", upload.single("image"), async (req, res) => {
  const { token, name, catagory, qty, realRate, discription, edition, auther } = req.body
  const { filename } = req.file
  // console.log(token)
  // console.log(name)
  // console.log(catagory)
  // console.log(qty)
  // console.log(realRate)
  // console.log(discription)
  // console.log(edition)
  const responce = authantication(token, admin_secret_key, req)
  if (responce.message != "Sucess") {
    res.status(401).json(responce)
  }

  const sql = "INSERT INTO items (name, catagory, qty, rate, discription, image , edition,auther) VALUES (?,?,?,?,?,?,?,?)"
  db.query(sql, [name, catagory, qty, realRate, discription, filename, edition, auther], (err, result) => {
    if (err) {
      console.log("Error In Registration: " + err)
      res.status(403).json({ message: "Token-Sucess db-error" })
    } else {
      const sql = "SELECT * FROM items"
      db.query(sql, [], (err, result) => {
        if (err) {
        } else {
          res.json({ message: "Sucess", data: result })
        }
      })
    }
  })
})

function getAvatar(mail) {
  return `https://gravatar.com/avatar/${md5(mail)}?s=128`
}

app.get("/", (req, res) => {
  return res.json("Server is Redy to run")
})
//Registration Endpoint
app.post("/register", async (req, res) => {
  const { fullname, username, email, phone, password, usertype } = req.body
  console.log(fullname)
  console.log(username)
  console.log(email)
  console.log(phone)
  console.log(password)
  //Hash the Password
  const hashedPassword = await bcrypt.hash(password, 10)
  console.log(hashedPassword)
  console.log(hashedPassword.length)

  const sql = "INSERT INTO users (fullname, username, email, phone, password, usertype ) VALUES (?, ?, ?, ? ,?,?)"
  db.query(sql, [fullname, username, email, phone, hashedPassword, usertype], (err, result) => {
    if (err) {
      console.log("Error In Registration: " + err)
      throw err
    } else {
      let token
      if (usertype != "6546ajhgawd") {
        token = jwt.sign({ userId: username }, user_secret_key, { expiresIn: "1h" })
      } else {
        token = jwt.sign({ userId: username }, admin_secret_key, { expiresIn: "1h" })
      }
      console.log(token)
      res.json({
        message: "Registration successful",
        user: {
          username: username,
          name: fullname,
          token: token,
          avatar: getAvatar(email),
          usertype: usertype,
          email: result[0].email,
          phone: result[0].phone,
        },
      })
    }
  })
})

//Login Endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body
  //Check if username and password are present
  console.log(username)
  console.log(password)
  if (!username || !password) {
    return res.status(400).json({ message: "userId and Password are Required" })
  }

  const sql = "SELECT * FROM users WHERE users.username = ?"
  db.query(sql, [username], async (err, result) => {
    if (err || result.length === 0) {
      console.log("Error Searching for userId: " + err)
      res.status(404).json({ message: "No username found" })
    } else {
      //compare hashed password

      const match = await bcrypt.compare(password, result[0].password)
      console.log(result[0].usertype)
      if (match) {
        let keys = [user_secret_key, admin_secret_key]
        let key
        if (result[0].usertype == "admin") {
          key = keys[1]
        } else {
          key = keys[0]
        }
        //create a jwt token
        console.log(result[0].username)
        const token = jwt.sign({ userId: result[0].username }, key, { expiresIn: "1h" })
        // let resData = await databaseStatus()
        // console.log("DATA")
        // console.log(resData)
        // console.log("END DATA")
        res.json({
          message: "Login Successful",
          user: {
            username: result[0].username,
            token: token,
            avatar: getAvatar(result[0].email),
            usertype: result[0].usertype,
            name: result[0].fullname,
            email: result[0].email,
            phone: result[0].phone,
          },
          // items: resData,
        })
      } else {
        res.status(401).json({ message: "Invalid Password" })
      }
    }
  })
})

app.get("/profile", userAuthenticate, (req, res) => {
  const userId = req.userId
  const sql = "SELECT * FROM users WHERE id = ?"
  db.query(sql, [userId], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ message: "Error Fetching Details" })
    } else {
      res.json({ username: result[0].username })
    }
  })
})

// Product LIst endpont
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products"
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error Fetching Products" })
    } else {
      res.json(result)
    }
  })
})

app.post("/update-user-data", async (req, res) => {
  const { name, email, phone, username } = req.body
  const query = `UPDATE users SET fullname= ? , email= ? , phone= ?  WHERE users.username= ?`
  console.log(query)
  db.query(query, [name, email, phone, username], async (err, resu) => {
    if (err) throw err
    res.json({ message: "Sucess" })
  })
})
app.listen(port, () => {
  console.log("Server is running ✌🏾")
})
