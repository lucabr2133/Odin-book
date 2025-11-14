import {  Router } from 'express';
import ControlerData from '../controller/controller.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { z } from 'zod';
function ensureAuth(req, res, next) {
  
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'No autorizado' });
}

const Loginrouter = Router();
const User = z.object(
  {
    username: z.string().min(4),

    password: z.string().min(8)

  }
);
const UserSign = z.object(
  {
    username: z.string().min(4),

    password: z.string().min(8)

  }
);
Loginrouter.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ mensaje: 'No autorizado' });
  }
  res.json({ mensaje: 'Acceso permitido', user: req.user });
});

Loginrouter.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const validate = UserSign.safeParse({ username, password });
    if (!validate.success) {
      const errors = {};
      for (const error of validate.error.errors) {
        const field = error.path[0];
        errors[field] = error.message;
      }
      return res.status(400).json({ errors });
    }

    const userCreate = await ControlerData.createUserController(username, hashed);
    res.json(userCreate);

  } catch (err) {
    console.log(err);
    
    if (err.message.includes("Username already exists")) {
      return res.status(400).json({ errors: { username: err.message } });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

Loginrouter.post('/', (req, res, next) => {
  
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Error del servidor' });
    if (!user) return res.status(401).json({ message: info.message || 'Credenciales incorrectas' });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: 'Error al iniciar sesión' });

      // Aquí podés enviar cualquier info que quieras al frontend
      return res.json({
        message: 'Login exitoso',
        user: { id: user.id, username: user.username }
      });
    });
  })(req, res, next);
});


Loginrouter.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.json({ redirectUrl: 'http://localhost:5173/' }); // Envía la URL como JSON
    });
  });
});

Loginrouter.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

// GitHub redirige aquí después de autenticarse
Loginrouter.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('http://localhost:5173/'); // o la página que quieras
  });
Loginrouter.get('/users', async (req, res) => {
  const users = await ControlerData.getUserController();
  res.json(users);
});
Loginrouter.get('/profile/:username/', async (req, res) => {
  const { username } = req.params;
  const user = await ControlerData.getuserController(username);
  res.json(user);
});

export { Loginrouter };
