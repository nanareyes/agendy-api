const User  = require('../models/user');
const bcrypt = require('bcrypt');

let regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

const ResetPassword = {
    async reset(req, res){
        if (!regExPassword.test(req.body.password)){
            res.send({
                message:
                'The password must contain at least: between 8 and 16 characters, 1 number, 1 lowercase letter, 1 capital letter and 1 special character'
            });
            return;
        }

        try {
            req.body.password = await bcrypt.hash(req.body.password, 10)
            const resetPassword = await User.update(req.body, {
                where: {
                    _id: req.params._id,
                    tokenresetpassword: req.params.tokenresetpassword
                }
            });
            res.status(201).send({
                message: 'Cambio de contraseña exitoso'
            })
        } catch (error) {
            res.status(500).send({
                message: 'Error',
                error
            })
        }
    }
}

module.exports = ResetPassword;