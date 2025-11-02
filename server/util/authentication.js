import jwt from "jsonwebtoken"

export const JWT_SECRET = "56h9skoa9ojsh6hi9"

export function authenticate(req, res, next) {
  const token = req.cookies.auth_token
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        const returnUrl = encodeURIComponent(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
        res.redirect(302, `https://auth.sunkastudios.xyz/?returnUrl=${returnUrl}`)
      } else {
        req.user = user
        next()
      }
    })
  } else {
    const returnUrl = encodeURIComponent(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
    res.redirect(302, `https://auth.sunkastudios.xyz/?returnUrl=${returnUrl}`)
  }
}
