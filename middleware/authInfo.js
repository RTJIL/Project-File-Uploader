export const authInfo = (req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated?.() || false
  res.locals.member = req.user?.member || false
  next()
}
