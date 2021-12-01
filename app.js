import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';


const app = express();


// Conexión base de datos
const mongoose = require('mongoose');

import { verificarAuth } from './middlewares/autenticacion';

// const uri = 'mongodb://localhost:27017/agendyDB';
const uri = 'mongodb+srv://AgendyDB:agendyDB@cluster0.9sfy7.mongodb.net/AgendyDB?retryWrites=true&w=majority';
const options = { useNewUrlParser: true, useUnifiedTopology: true };

// Controler del password
const forgotpasswordController = require('./password/forgotPasswordController');
const resetpasswordController = require('./password/resetPasswordController');


// Or using promises
mongoose.connect(uri, options).then(
    () => { console.log('Conectado a DB') },
    err => { console.log(err) }
);

//Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RUTA
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use('/api', require('./routes/resetPassword'));
app.use('/api', require('./routes/forgotPassword'));
app.use('/api', require('./routes/servicio'));
app.use('/api', require('./routes/user'));
app.use('/api/appointment', require('./routes/appointment'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/agenda', verificarAuth, require('./routes/agenda'));
app.use('/login', require('./routes/login'));


// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

//PUERTO
// app.listen(3000, function () {
// console.log('Example app listening on port 3000!');
// });
app.set('puerto', process.env.PORT || 4000);
app.listen(app.get('puerto'), function () {
    console.log('Example app listening on port' + app.get('puerto'));
});
