import express from "express"
import fs from "fs"
import path from "path"

import { PUBLIC_DIR } from "../paths.js"

const auth_app = express()

const LATEST_VERSION = "v1"

auth_app.get("/", (req, res) => {
  res.redirect(301, `/${LATEST_VERSION}/index.html`)
})

auth_app.get("/v1/ain.html", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "ain.html")))
})

auth_app.get("/v1/index.html", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "index.html")))
})

auth_app.get("/v1/main.js", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/javascript"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "main.js")))
})

auth_app.get("/v1/main.css", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/css"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth", "v1", "main.css")))
})

export default auth_app
