console.log("Starting Server...")

console.log("Importing Packages...")
import express from "express"
import vhost from "vhost"
import path from "path"
import fs from "fs"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import { fileURLToPath } from "url"

console.log("Importing Modules & Constants...")
export const PORT = 8080
import { APPS_DIR } from "./paths.js"
import { SSL_DIR } from "./paths.js"
// import various subdomains
const auth_app = (await import(path.join(APPS_DIR, "auth.js"))).default
const homepage_app = (await import(path.join(APPS_DIR, "homepage.js"))).default

console.log("Creating Server...")
const app = express()

console.log("Configuring Server...")
// use rateLimit to prevent DDoS Attacks
app.use(rateLimit({windowMS: 60000, max: 100}))
// add safety headers
app.use(helmet())
// use vhost to redirect requests to appropriate servers
app.use(vhost("auth.localhost", auth_app))
app.use(homepage_app)

// listen for requests
app.listen(PORT, () => {
	console.log(`Listening on Local Port ${PORT}`)
})
