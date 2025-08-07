const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const {
  validate,
  authSchemas,
} = require("../../infrastructure/middlewares/validation.middleware");
const {
  authMiddleware,
} = require("../../infrastructure/middlewares/auth.middleware");

const router = express.Router();

// Rutas públicas
router.post(
  "/register",
  validate(authSchemas.register),
  authController.register
);
router.post("/login", validate(authSchemas.login), authController.login);

// Rutas protegidas
router.get("/profile", authMiddleware, authController.getProfile);

// Ruta para iniciar login con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Ruta de callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login-failed",
    session: false,
  }),
  authController.googleCallback
);

router.get("/login-failed", (req, res) => {
  res.status(401).json({ success: false, message: "Login con Google fallido" });
});

module.exports = router;