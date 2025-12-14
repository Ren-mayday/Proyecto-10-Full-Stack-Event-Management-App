const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("No tienes permisos de administración");
  }

  next();
};

module.exports = { isAdmin };
