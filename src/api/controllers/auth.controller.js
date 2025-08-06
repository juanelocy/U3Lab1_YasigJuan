const registerUserUseCase = require("../../domain/use-cases/register-user.use-case");
const loginUserUseCase = require("../../domain/use-cases/login-user.use-case");

class AuthController {
  async register(req, res) {
    try {
      const { email, password } = req.body;

      const result = await registerUserUseCase.execute({ email, password });

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        data: result,
      });
    } catch (error) {
      console.error("Error en registro:", error);

      if (error.message.includes("ya existe")) {
        return res.status(409).json({
          success: false,
          error: error.message,
        });
      }

      if (
        error.message.includes("requerido") ||
        error.message.includes("caracteres")
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await loginUserUseCase.execute({ email, password });

      res.status(200).json({
        success: true,
        message: "Login exitoso",
        data: result,
      });
    } catch (error) {
      console.error("Error en login:", error);

      if (error.message.includes("Credenciales inválidas")) {
        return res.status(401).json({
          success: false,
          error: "Credenciales inválidas",
        });
      }

      if (error.message.includes("requerido")) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      });
    }
  }

  async getProfile(req, res) {
    try {
      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      });
    }
  }
}

module.exports = new AuthController();
