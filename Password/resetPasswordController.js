const { User } = require('../models');
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
                    id: req.params.id,
                    tokenresetpassword: req.params.tokenresetpassword
                }
            });
            res.status(201).send({
                message: 'Contraseña cambiada con éxito'
            })
        } catch (error) {
            res.status(500).send({
                message: 'este error',
                error
            })
        }
    }
}

module.exports = ResetPassword;