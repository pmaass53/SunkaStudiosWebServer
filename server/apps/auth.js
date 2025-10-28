import express from "express"
import fs from "fs"
import path from "path"

import { PUBLIC_DIR } from "../paths.js"
import { AUTHDB } from "../database/auth_db.js"

const auth_app = express()

const LATEST_VERSION = "v1"

auth_app.use(express.json({ type: "application/json" }))
auth_app.use(express.text({ type: "text/plain" }))
auth_app.use(express.urlencoded({ extended: true }))

auth_app.get("/", (req, res) => {
  res.redirect(301, `/${LATEST_VERSION}/login/index.html`)
})

auth_app.get("/v1/ain.html", (req, res) => {
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

// login handling
auth_app.post("/v1/login/api/postdata", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"})
  const { username, password } = req.body
  console.log(`Login Request for ${username}: '${password}'`)
  res.end("Login is not yet fully supported")
})

export default auth_app
