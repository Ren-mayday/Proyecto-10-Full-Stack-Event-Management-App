const { verifyJWT } = require("../config/jwt");
const User = require("../api/models/User");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).json("No estás autorizado para hacer esta acción");
    }

    const parsedToken = token.replace("Bearer ", "");
    const { id } = verifyJWT(parsedToken);
    const user = await User.findById(id);

    if (!user) {
      return res.status(403).json("Token inválido o usuario no encontrado");
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
      error: error.message,
    });
  }
};

module.exports = { isAuth };
