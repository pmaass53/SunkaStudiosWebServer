import jwt from "jsonwebtoken"

const JWT_SECRET = "56h9skoa9ojsh6hi9"

export function authenticate(req, res, next) {
  const token = req.cookies.auth_token
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        res.redirect(302, "https://auth.sunkastudios.xyz")
      } else {
        req.user = user
        next()
      }
    })
  } else {
    res.redirect(302, "https://auth.sunkastudios.xyz")
  }
}
