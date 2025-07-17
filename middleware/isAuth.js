export function isAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect("/"); // or res.status(401).send("Unauthorized")
}
