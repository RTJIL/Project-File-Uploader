export function isAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
