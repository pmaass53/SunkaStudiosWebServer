import express from "express"
import fs from "fs"
import path from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"

import { PUBLIC_DIR } from "../paths.js"
import { JWT_SECRET } from "../util/authentication.js"
import { getUser, createUser, getUsers } from "../database/auth_db.js"
import { authenticate } from "../util/authentication.js"

const auth_app = express()

const LATEST_VERSION = "v1"

auth_app.use(express.json({ type: "application/json" }))
auth_app.use(express.text({ type: "text/plain" }))
auth_app.use(express.urlencoded({ extended: true }))
auth_app.use(cookieParser())

auth_app.get("/", (req, res) => {
  if (req.query.returnUrl) {
    res.redirect(302, `/${LATEST_VERSION}/login/index.html?returnUrl=${encodeURIComponent(req.query.returnUrl)}`)
  } else {
    res.redirect(302, `/${LATEST_VERSION}/login/index.html`)
  }
})

auth_app.get("/login", (req, res) => {
  if (req.query.returnUrl) {
    res.redirect(302, `/${LATEST_VERSION}/login/index.html?returnUrl=${encodeURIComponent(req.query.returnUrl)}`)
  } else {
    res.redirect(302, `/${LATEST_VERSION}/login/index.html`)
  }
})

auth_app.get("/signup", (req, res) => {
  if (req.query.returnUrl) {
    res.redirect(302, `/${LATEST_VERSION}/signup/index.html?returnUrl=${encodeURIComponent(req.query.returnUrl)}`)
  } else {
    res.redirect(302, `/${LATEST_VERSION}/signup/index.html`)
  }
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
// dev testing; remove later
auth_app.get("/dev/users", authenticate, (req, res) => {
  if (permitted(req.user, 2)) {
    getUsers((err, users) => {
      if (err) {
        console.error("Dev/Users: ", err.toString())
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Error fetching users")
      } else {
        if (users.length > 0) {
          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify(users))
        } else {
          res.writeHead(200, { "Content-Type": "application/json" })
          res.end("[]")
        }
      }
    })
  } else {
    res.writeHead(401, { "Content-Type": "text/plain" })
    res.end("Not enough permissions")
  }
})

// signup handling
auth_app.post("/v1/signup/api/postdata", (req, res) => {
  const { username, password, email } = req.body
  // protect against SQL injections
  const pattern = /^[A-Za-z0-9_]{3,20}$/;
  if (username && password) {
    if (pattern.test(username)) {
      bcrypt.hash(password, 10, (berr, hash) => {
        createUser(username, hash, email, 1, (serr, user) => {
          if (serr) {
            if (serr.message.includes("UNIQUE")) {
              res.writeHead(409, { "Content-Type": "text/plain" })
              res.end("User already exists")
            } else {
              console.error("Signup/Database Error: ", serr)
              res.writeHead(500, { "Content-Type": "text/plain" })
              res.end(`Internal Server Error: ${serr.message}`)
            }
          } else {
            res.writeHead(201, { "Content-Type": "text/plain" })
            res.end("User Created")
          }
        })
      })
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" })
      res.end("Blocked for security reasons")
    }
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" })
    res.end("Missing Username/Password")
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
          if (user) {
            bcrypt.compare(password, user.password, (err, match) => {
              if (err) {
                console.error("Login/Bcrypt Error: ", err)
                res.writeHead(500, { "Content-Type": "text/plain" })
                res.end(`Internal Server Error: ${err.message}`)
              } else {
                if (match) {
                  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" })
                  res.cookie("auth_token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "Strict",
                    maxAge: 3600000,
                    domain: ".sunkastudios.xyz"
                  })
                  res.writeHead(200, { "Content-Type": "text/plain" })
                  res.end("Logged In")
                } else {
                  res.writeHead(401, { "Content-Type": "text/plain" })
                  res.end("Username or password incorrect")
                }
              }
            })
          } else {
            res.writeHead(401, { "Content-Type": "text/plain" })
            res.end("Username or password incorrect")
          }
        }
      })
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" })
      res.end("Blocked for security reasons")
    }
  }
})

export default auth_app
