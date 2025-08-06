const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Token de acceso requerido",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: "Token inválido",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Token inválido",
      });
    }

    return res.status(500).json({
      error: "Error en la autenticación",
    });
  }
};

const verifyWebSocketToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token requerido");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Token inválido");
  }
};

module.exports = {
  authMiddleware,
  verifyWebSocketToken,
};
