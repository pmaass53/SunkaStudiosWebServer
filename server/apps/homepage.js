import express from "express"
import fs from "fs"
import path from "path"

import { PUBLIC_DIR } from "../paths.js"

const homepage_app = express()

homepage_app.get("/", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "index.html")))
})
homepage_app.get("/favicon.ico", (req, res) => {
  res.writeHead(200, {"Content-Type": "image/x-icon"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "favicon.ico")))
})

export default homepage_app
