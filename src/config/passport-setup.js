const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// Importa tus casos de uso o servicios para buscar/crear usuarios
// const { findUserByProviderId, createUser } = require('../services/userService');
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        // Esta función se ejecuta después de que el usuario autoriza a Google
        try {
            // 1. Verifica si el usuario ya existe en tu DB con su ID de Google
            // let user = await findUserByProviderId(profile.id);
            // if (user) {
            // return done(null, user); // El usuario ya existe, lo pasamos al siguiente paso
            // }
            // 2. Si no existe, crea un nuevo usuario en tu base de datos
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                // Asigna un rol por defecto, ej. 'cliente'
                // role: 'cliente'
            };
            // user = await createUser(newUser);
            // return done(null, user); // Pasamos el nuevo usuario creado
            // --- SIMULACIÓN PARA LA TAREA ---
            // Como no tengo tu código, aquí simulamos el proceso.
            // En tu implementación real, debes interactuar con tu base de datos.
            console.log('Perfil de Google recibido:', profile);
            const mockUser = { id: profile.id, email: profile.emails[0].value, name: profile.displayName };
            return done(null, mockUser); // `mockUser` es lo que se adjuntará a `req.user`
        } catch (error) {
            return done(error, false);
        }
    }));
// Passport necesita estas funciones para manejar la sesión (aunque usemos JWT)
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    // Aquí buscarías al usuario en tu DB por su ID
    // const user = await findUserById(id);
    const mockUser = { id: id }; // Simulación
    done(null, mockUser);
});