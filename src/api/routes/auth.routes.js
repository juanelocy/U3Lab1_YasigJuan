const express = require("express");
const router = express.Router(); // Mover esta línea aquí ARRIBA

const authController = require("../controllers/auth.controller");
const {
  validate,
  authSchemas,
} = require("../../infrastructure/middlewares/validation.middleware");
const {
  authMiddleware,
} = require("../../infrastructure/middlewares/auth.middleware");

const passport = require('passport');

// Ruta para iniciar el proceso de autenticación con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Ruta de callback a la que Google redirige tras la autorización
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login-error' }),
  (req, res) => {
    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    res.redirect(`http://localhost:3001/auth/callback?token=${mockToken}`);
  }
);

// Rutas públicas
router.post(
  "/register",
  validate(authSchemas.register),
  authController.register
);
router.post("/login", validate(authSchemas.login), authController.login);

// Rutas protegidas
router.get("/profile", authMiddleware, authController.getProfile);



module.exports = router;
