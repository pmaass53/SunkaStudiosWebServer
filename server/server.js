console.log("Starting Server...")

console.log("Importing Packages...")
import express from "express"
import vhost from "vhost"
import path from "path"
import fs from "fs"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import morgan from "morgan"
import { fileURLToPath } from "url"

console.log("Importing Modules & Constants...")
// internal port
// DO NOT MODIFY
export const PORT = 8080
// import relative paths
import { APPS_DIR } from "./paths.js"
import { SSL_DIR } from "./paths.js"
// import various subdomains
const auth_app = (await import(path.join(APPS_DIR, "auth.js"))).default
const homepage_app = (await import(path.join(APPS_DIR, "homepage.js"))).default
const controlpanel_app = (await import(path.join(APPS_DIR, "controlpanel.js"))).default

console.log("Creating Server...")
const app = express()

console.log("Configuring Server...")
// use rateLimit to prevent DDoS Attacks
app.use(rateLimit({windowMS: 60000, max: 100}))
// add safety headers
app.use(helmet())
// log requests
app.use(morgan(":method :url :status - :response-time ms"))
// use vhost to redirect requests to appropriate servers
app.use(vhost("auth.sunkastudios.xyz", auth_app))
app.use(vhost("controlpanel.sunkastudios.xyz", controlpanel_app))
// serve rest to homepage app
app.use(homepage_app)

// listen for requests
app.listen(PORT, () => {
	console.log(`Listening on Local Port ${PORT}`)
})
