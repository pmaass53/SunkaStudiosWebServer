import jwt from "jsonwebtoken"
import { getUser } from "../database/auth_db.js"

export const JWT_SECRET = "56h9skoa9ojsh6hi9"

export function authenticate(required_privilege = 0) {
  return (req, res, next) => {
    if (req.cookies.auth_token) {
      const token = req.cookies.auth_token
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          const returnUrl = encodeURIComponent(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
          res.redirect(302, `https://auth.sunkastudios.xyz/?returnUrl=${returnUrl}`)
        } else {
          if (user.privilege >= required_privilege) {
            req.user = user
            next()
          } else {
            res.writeHead(401, { "Content-Type": "text/plain" })
            res.end("You are not allowed to visit this page")
          }
        }
      })
    } else {
      const returnUrl = encodeURIComponent(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
      res.redirect(302, `https://auth.sunkastudios.xyz/?returnUrl=${returnUrl}`)
    }
  }
}
