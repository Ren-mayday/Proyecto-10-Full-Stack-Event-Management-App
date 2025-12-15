const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, default: "" },
    imageURL: { type: String, required: false, trim: true, default: "" },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Formatear fecha
eventSchema.virtual("formattedDate").get(function () {
  const day = String(this.date.getDate()).padStart(2, "0");
  const month = String(this.date.getMonth() + 1).padStart(2, "0");
  const year = this.date.getFullYear();
  const hours = String(this.date.getHours()).padStart(2, "0");
  const minutes = String(this.date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
});

const Event = mongoose.model("Event", eventSchema, "events");
module.exports = Event;
