import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const PROJECT_ROOT = path.resolve(__dirname, "..")
export const SERVER_DIR = __dirname
export const PUBLIC_DIR = path.join(__dirname, "public")
export const APPS_DIR = path.join(__dirname, "apps")
export const DATABASE_DIR = path.join(__dirname, "database")
export const SSL_ROOT = path.join(__dirname, "ssl")
