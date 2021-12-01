import express from "express";
const router = express.Router();
const { verificarAuth } = require('../middlewares/autenticacion.js');
//importar modelo
import User from "../models/user";
// Hash Contraseña
const bcrypt = require('bcrypt');
// JWT
const jwt = require('jsonwebtoken');



const saltRounds = 10;
router.get('/user', verificarAuth, async (req, res) => {

})

router.get('/users', async (req, res) => {
    const { userType = "ALL" } = req.query
    const query = userType === "ALL" ? {} : { userType: userType }

    try {
        const users = await User.find(query)
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
})

//Ruta para crear un nuevo user
router.post('/new-user', async (req, res) => {
    let body = req.body;
    if (body.password) {
        body.password = bcrypt.hashSync(body.password, saltRounds);
    }
    console.log('body**********************', body);


    try {
        // Generar Token
        let token = jwt.sign({
            data: userDB
        }, 'secret', { expiresIn: 60 * 60 * 24 * 30 }) // Expira en 30 días


        const userDB = await User.create(body);
        res.status(200).json({
            userDB,
            token
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

//Ruta para consultar todos los User
router.get('/user', async (req, res) => {
    try {
        const userDB = await User.find();
        res.json(userDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Se presentó un error al consultar los usuarios ',
            error
        })
    }
});
//Ruta para consultar un User
router.get('/user/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const userDB = await User.findOne({ _id });
        res.json(userDB);
    }
    catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

// Delete eliminar un User
router.delete('/user/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const userDB = await User.findByIdAndDelete({ _id });
        if (!userDB) {
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        res.json(userDB);
    }
    catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

// Put actualizar un User
router.put('/user/:id', async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    console.log(body.dateOfBirth)
    console.log(body.phone)
    console.log(body.address)
    console.log(body.city)
    console.log(body.userType)

    try {
        const userDB = await User.findByIdAndUpdate(
            _id, body, { new: true });
        res.json(userDB);
    }
    catch (error) {
        console.log('Datos no actualizados');
        console.log(error);
        return res.status(400).json({
            mensaje: 'Ocurrio un error', error
        })
    }
});


// Exportar configuración
module.exports = router;