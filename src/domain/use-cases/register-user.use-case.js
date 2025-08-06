const userRepository = require("../../infrastructure/repositories/user.repository");
const jwt = require("jsonwebtoken");

class RegisterUserUseCase {
  async execute(userData) {
    const { email, password } = userData;

    // Validar datos de entrada
    if (!email || !password) {
      throw new Error("Email y password son requeridos");
    }

    if (password.length < 6) {
      throw new Error("Password debe tener al menos 6 caracteres");
    }

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Usuario con este email ya existe");
    }

    try {
      // Crear nuevo usuario
      const user = await userRepository.create({ email, password });

      // Generar token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      return {
        user: {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Usuario con este email ya existe");
      }
      throw error;
    }
  }
}

module.exports = new RegisterUserUseCase();
