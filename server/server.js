console.log("Starting Server...")

console.log("Importing Packages...")
import express from "express"
import vhost from "vhost"

console.log("Importing Modules & Constants...")
const PORT = 8080
// import various subdomains
import auth_app from "./apps/auth.js"

console.log("Creating Server...")
const app = express()

console.log("Configuring Server...")
// use vhost to redirect requests to appropriate servers
app.use(vhost("auth.localhost", auth_app))

// listen for requests
app.listen(PORT, ()=> {
  console.log(`Listening On Port ${PORT}`)
})
