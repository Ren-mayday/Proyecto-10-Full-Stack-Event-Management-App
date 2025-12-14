const { isAdmin } = require("../../middlewares/isAdmin");
const { isAuth } = require("../../middlewares/isAuth");
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  attendEvent,
  deleteEvent,
} = require("../controllers/eventControllers");

const eventRoutes = require("express").Router();

// Público
eventRoutes.get("/", getEvents);
eventRoutes.get("/:id", getEventById);
// Privado (cualquier usuario autenticado)
eventRoutes.post("/", [isAuth], createEvent);
eventRoutes.post("/:id/attend", [isAuth], attendEvent);

eventRoutes.put("/:id", [isAuth], updateEvent);
eventRoutes.delete("/:id", [isAuth], deleteEvent);

module.exports = eventRoutes;
