function admin(req, res, next) {
  if (!user.isAdmin) return res.status(403).send("Access deneid!.");

  next();
}

module.exports = admin;
