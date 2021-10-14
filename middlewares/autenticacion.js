const jwt = require('jsonwebtoken');

let verificarAuth = (req, res, next) => {

  // Leer headers
  let token;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log('token', token);

  jwt.verify(token, 'secret', (err, decoded) => {

    if(err) {
      return res.status(401).json({
        mensaje: 'Error de token',
        err
      })
    }

    // Creamos una nueva propiedad con la info del usuario
    req.user = decoded.data; //data viene al generar el token en login.js
    next();

  });

}

module.exports = {verificarAuth};