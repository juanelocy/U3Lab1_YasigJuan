const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Texto del mensaje es requerido"],
      trim: true,
      maxlength: [1000, "Mensaje no puede exceder 1000 caracteres"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Usuario es requerido"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para mejorar rendimiento en consultas por fecha
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
