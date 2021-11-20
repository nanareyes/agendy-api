import express from "express";
const router = express.Router();

import User from '../models/user';
const bcrypt = require('bcrypt');


let regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

router.put('/resetPassword/:id/:token', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const token = req.params.tokenresetpassword;
    const password = body.password;
    if (!regExPassword.test(password)){
        res.send({
            message:
            'The password must contain at least: between 8 and 16 characters, 1 number, 1 lowercase letter, 1 capital letter and 1 special character'
        });
        return;
    }

    try {
        password = await bcrypt.hash(password, 10)
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
        res.status(500).send({
            message: 'Error',
            error
        })
    }
});
// Exportar configuración
module.exports = router;

