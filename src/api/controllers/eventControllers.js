const Event = require("../models/Event");

//GET /events -> público. Ordenados por fecha
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json("Error al obtener eventos");
  }
};

// GET /events/:id -> público. Detalle + asistentes
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate("attendees", "userName email");

    if (!event) {
      return res.status(404).json("Evento no encontrado");
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json("Error al obtener el evento");
  }
};

// POST /events -> privado - cualquier user
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json("Faltan campos obligatorios");
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      imageURL: req.file?.path || "",
      createdBy: req.user._id,
    });

    const savedEvent = await newEvent.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    return res.status(500).json("Error al crear el evento");
  }
};

// PUT /event/:id (privado - admin o creador)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json("Evento no encontrado");
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = event.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json("No tienes permisos para editar este evento");
    }

    const { title, description, date, location } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;
    if (req.file) event.imageURL = req.file.path;

    const updatedEvent = await event.save();
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).json("Error al actualizar el evento");
  }
};

//POST /event/:id/attend -> privado
// Inserción usuario -> evento
const attendEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json("Evento no encontrado");
    }

    // Evitar duplicado
    if (event.attendees.includes(userId)) {
      return res.status(400).json("Ya estás apuntado a este evento");
    }

    event.attendees.push(userId);
    await event.save();

    return res.status(200).json("Asistencia confirmada");
  } catch (error) {
    return res.status(500).json("Error al apuntarse al evento");
  }
};

// DELETE /events/:id (privado - admin o creador)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json("Evento no encontrado");
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = event.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json("No tienes permisos para eliminar este evento");
    }

    await Event.findByIdAndDelete(id);

    return res.status(200).json("Evento eliminado correctamente");
  } catch (error) {
    return res.status(500).json("Error al eliminar el evento");
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  attendEvent,
  deleteEvent,
};
