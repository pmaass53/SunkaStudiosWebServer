console.log("Starting Server...")

console.log("Importing Packages...")
import express from "express"
import vhost from "vhost"

console.log("Importing Modules & Constants...")
const PORT = 8080
import auth_app from "./apps/auth.js"

console.log("Creating Server...")
const app = express()

console.log("Configuring Server...")
app.use(vhost("auth.local", auth_app))

app.listen(PORT)
