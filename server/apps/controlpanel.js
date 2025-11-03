import express from "express"
import fs from "fs"
import path from "path"
import cookieParser from "cookie-parser"
import { exec } from "node:child_process"

import { PUBLIC_DIR } from "../paths.js"
import { authenticate } from "../util/authentication.js"

const ctl_app = express()

ctl_app.use(cookieParser())

ctl_app.get("/", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "controlpanel.html")))
})

ctl_app.post("/git-update", authenticate(0), (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Updating Server...")
  exec("../download.sh", (err, stdout, stderr) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" })
      res.end(err.toString())
    } else {
      if (stderr) {
        console.warn("STDERR: ", stderr.toString())
      }
    }
  })
})

export default ctl_app
