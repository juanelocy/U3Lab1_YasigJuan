const messageRepository = require("../../infrastructure/repositories/message.repository");

class GetMessagesUseCase {
  async execute(options = {}) {
    const { limit = 50, page = 1 } = options;

    try {
      // Obtener mensajes recientes
      const messages = await messageRepository.findRecent(limit);

      // Formatear respuesta
      return messages.map((message) => ({
        id: message._id,
        text: message.text,
        user: {
          id: message.user._id,
          email: message.user.email,
        },
        createdAt: message.createdAt,
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new GetMessagesUseCase();
