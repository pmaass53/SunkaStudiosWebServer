console.log("Starting Server...")

console.log("Importing Packages...")
import express from "express"
import vhost from "vhost"
import path from "path"
import { fileURLToPath } from "url"

console.log("Importing Modules & Constants...")
export const PORT = 8080
import { APPS_DIR } from "./paths.js"
// import various subdomains
import auth_app from path.join(APPS_DIR, "auth.js")
import homepage_app from path.join(APPS_DIR, "auth.js")

console.log("Creating Server...")
const app = express()

console.log("Configuring Server...")
// use vhost to redirect requests to appropriate servers
app.use(vhost("auth.localhost", auth_app))
app.use(homepage_app)

// listen for requests
app.listen(PORT, ()=> {
  console.log(`Listening On Port ${PORT}`)
})
