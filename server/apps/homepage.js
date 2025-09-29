import express from "express"
import fs from "fs"

const homepage_app = express()

homepage_app.get("/", (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"})
  res.end(fs.readFileSync("./public/index.html"))
})

export default homepage_app
