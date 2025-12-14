const { isAuth } = require("../../middlewares/isAuth");
const { registerUser, loginUser, updateUser, getUserProfile, deleteUser } = require("../controllers/userControllers");

const userRoutes = require("express").Router();

// Registro
userRoutes.post("/register", registerUser);

// Login
userRoutes.post("/login", loginUser);

// Obtener perfil (admin o dueño → controlado en el controller)
userRoutes.get("/:userName", [isAuth], getUserProfile);

// Update user (admin o dueño → controlado en el controller)
userRoutes.put("/:id", [isAuth], updateUser);

// Delete user (admin o dueño → controlado en el controller)
userRoutes.delete("/:id", [isAuth], deleteUser);

module.exports = userRoutes;
