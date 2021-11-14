const express = require('express');
const router = express.Router();
import User from '../models/user';
const bcrypt = require('bcrypt');
const saltRounds = 10;
// JWT
const jwt = require('jsonwebtoken');



router.get('/', async (req, res) => {
  res.json({ mensaje: 'Funciona!' })
})

router.post('/', async (req, res) => {

  let body = req.body;

  try {
    let searchUser = { email: body.email };
    if (body.loginType === 'GOOGLE') {
      searchUser = { googleId: body.googleId }
    }
    // Buscamos email en DB
    let userDB = await User.findOne(searchUser);
    if(!userDB && body.loginType === 'GOOGLE') {
      userDB = await User.create(body);
    }
    // Evaluamos si existe el usuario en DB
    if (!userDB) {
      return res.status(400).json({
        mensaje: body.loginType === 'GOOGLE' ? 'Usuario no registrado!' : 'Usuario o contraseña inválidos!',
      });
    }

    // Evaluamos la contraseña correcta

    if (body.loginType === 'AGENDY') {
      if (!bcrypt.compareSync(body.password, userDB.password)) {
        return res.status(400).json({
          mensaje: 'Usuario o contraseña! inválidos',
        });
      }
    }

    // Generar Token
    let token = jwt.sign({
      data: userDB
    }, 'secret', { expiresIn: 60 * 60 * 24 * 30 }) // Expira en 30 días

    // Pasó las validaciones
    return res.json({
      userDB,
      token: token
    })

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    });
  }

});


module.exports = router;