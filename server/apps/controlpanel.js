import express from "express"
import fs from "fs"
import path from "path"
import { execFile } from "node:child_process"

import { PUBLIC_DIR } from "../paths.js"
import { authenticate } from "../util/authentication.js"

const ctl_app = express()

ctl_app.get("/", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "controlpanel.html")))
})

ctl_app.post("/git-update", authenticate(0), (req, res) => {
  execFile("../update.sh", (err) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" })
      res.end(err.toString())
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end("Successfully Updated")
    }
  })
})

export default ctl_app
