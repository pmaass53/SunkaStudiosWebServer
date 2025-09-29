import express from "express"
import fs from "fs"
import path from "path"

import { PUBLIC_DIR } from "./paths.js"

const auth_app = express()

auth_app.get("/", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync(path.join(PUBLIC_DIR, "auth.html")))
})

export default auth_app
