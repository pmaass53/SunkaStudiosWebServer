import express from "express"
import fs from "fs"
import path from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { PUBLIC_DIR } from "../paths.js"
import { getUser, createUser } from "../database/auth_db.js"

const auth_app = express()

const LATEST_VERSION = "v1"

auth_app.use(express.json({ type: "application/json" }))
auth_app.use(express.text({ type: "text/plain" }))
auth_app.use(express.urlencoded({ extended: true }))

auth_app.get("/", (req, res) => {
  res.redirect(301, `/${LATEST_VERSION}/login/index.html`)
})

auth_app.get("/v1/login/ain.html", (req, res) => {
  // res.writeHead(200, {"Content-Type": "text/html"})
  // res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "login", "ain.html")))
  res.writeHead(501, { "Content-Type": "text/plain" })
  res.end("AIN login is not yet supported")
})

auth_app.get("/v1/login/index.html", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "login", "index.html")))
})

auth_app.get("/v1/login/main.js", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/javascript"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "login", "main.js")))
})

auth_app.get("/v1/login/main.css", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/css"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "login", "main.css")))
})

auth_app.get("/v1/signup/index.html", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "signup", "index.html")))
})

auth_app.get("/v1/signup/main.js", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/javascript"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "signup", "main.js")))
})

auth_app.get("/v1/signup/main.css", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/css"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "signup", "main.css")))
})

// signup handling
auth_app.post("/v1/signup/api/postdata", (req, res) => {
  const { username, password } = req.body
  // protect against SQL injections
  const pattern = /^[A-Za-z0-9_]{3,20}$/;
  if (username && password) {
    if (pattern.test(username)) {
      createUser(username, password, (err, user) => {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            res.writeHead(409, { "Content-Type": "text/plain" })
            res.end("User already exists")
          } else {
            console.error("Signup/Database Error: ", err)
            res.writeHead(500, { "Content-Type": "text/plain" })
            res.end(err)
          }
        } else {
          res.writeHead(201, { "Content-Type": "text/plain" })
          res.end("User Created")
        }
      })
    }
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" })
    res.end("Blocked for security reasons")
  }
})

// login handling
auth_app.post("/v1/login/api/postdata", (req, res) => {
  const { username, password } = req.body
  // protect against SQL injections
  const pattern = /^[A-Za-z0-9_]{3,20}$/;
  if (username && password) {
    if (pattern.test(username)) {
      getUser(username, (err, user) => {
        if (err) {
          console.error("Login/Database Error: ", err)
          res.writeHead(500, { "Content-Type": "text/plain" })
          res.end(err)
        } else {
          bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
              console.error("Login/Bcrypt Error: ", err)
              res.writeHead(500, { "Content-Type", "text/plain" })
              res.end(err)
            } else {
              if (match) {
                res.writeHead(200, { "Content-Type": "text/plain" })
                res.end("Logged In")
              } else {
                res.writeHead(401, { "Content-Type": "text/plain" })
                res.end("Username or password incorrect")
              }
            }
          })
        }
      })
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" })
      res.end("Blocked for security reasons")
    }
  }
})

export default auth_app
