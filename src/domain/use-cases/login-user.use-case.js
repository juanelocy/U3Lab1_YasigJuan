const userRepository = require("../../infrastructure/repositories/user.repository");
const jwt = require("jsonwebtoken");

class LoginUserUseCase {
  async execute(credentials) {
    const { email, password } = credentials;

    // Validar datos de entrada
    if (!email || !password) {
      throw new Error("Email y password son requeridos");
    }

    // Buscar usuario por email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas");
    }

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
  }
}

module.exports = new LoginUserUseCase();
