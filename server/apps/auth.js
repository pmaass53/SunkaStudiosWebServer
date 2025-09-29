import express from "express"
import fs from "fs"

const auth_app = express()

auth_app.get("/", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync("./public/auth.html"))
})

export default auth_app
