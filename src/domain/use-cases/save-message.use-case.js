const messageRepository = require("../../infrastructure/repositories/message.repository");

class SaveMessageUseCase {
  async execute(messageData) {
    const { text, userId } = messageData;

    // Validar datos de entrada
    if (!text || !userId) {
      throw new Error("Texto del mensaje y usuario son requeridos");
    }

    if (text.trim().length === 0) {
      throw new Error("El mensaje no puede estar vacío");
    }

    if (text.length > 1000) {
      throw new Error("El mensaje no puede exceder 1000 caracteres");
    }

    try {
      // Guardar mensaje en la base de datos
      const message = await messageRepository.create({
        text: text.trim(),
        user: userId,
      });

      return {
        id: message._id,
        text: message.text,
        user: {
          id: message.user._id,
          email: message.user.email,
        },
        createdAt: message.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SaveMessageUseCase();
