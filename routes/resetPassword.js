import express from "express";
const router = express.Router();

import User from '../models/user';
const bcrypt = require('bcrypt');

router.post('/resetPassword', async (req, res) => {
    const id = req.query.id;
    let body = req.body;
    const token = req.query.token;
    let password = body.password;

    try {
        body.password = await bcrypt.hash(password, 10)
        const filter = {
            _id: id,
            tokenresetpassword: token
        }
        const resetPassword = await User.findByIdAndUpdate(
            filter, body, { new: true });
        /* const resetPassword = await User.update(req.body, {
            where: {
                _id: req.params._id,
                tokenresetpassword: req.params.tokenresetpassword
            }
        }); */
        res.status(201).send({
            message: 'Cambio de contraseña exitoso'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error en el cambio de contarseña',
            error
        })
    }
});
// Exportar configuración
module.exports = router;

