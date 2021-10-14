import express from "express";
const router = express.Router();

//importar modelo
import Agenda from "../models/agenda";

//Ruta para crear un nuevo turno
router.post('/nueva-agenda', async (req, res) => {
    const body = req.body;
    const user = req.user;
    console.log(body);
    console.log(req.user);

    const cita = {
        idUsuario: user._id,
        fecha_agenda: body.fecha_agenda,
        ciudad: body.ciudad,
        email: body.email,
        telefono: body.telefono,
    }

    try {
        const agendaDB = await Agenda.create(cita);
        res.status(200).json(agendaDB);
    }
    catch (error) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

//Ruta para consultar todos los turnos
router.get('/agenda', async(req,res)=> {
    try {
        const agendaDB = await Agenda.find();
        res.json(agendaDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Se presentó un error al consultar los turnos',
            error
        })
    }
});

//Ruta para consultar un turno
router.get('/agenda/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const agendaDB = await Agenda.findOne({ _id });
        res.json(agendaDB);
    }
    catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});


// Delete eliminar un turno
router.delete('/eliminar-agenda/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const agendaDB = await Agenda.findByIdAndDelete({ _id });

        if (!agendaDB) {
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        res.json(separaTuTurnoDB);
    }

    catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

// Put actualizar un turno
router.put('/actualizar-agenda/:id', async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
        const agendaDB = await Agenda.findByIdAndUpdate(
            _id, body, { new: true });
        res.json(agendaDB);
    }
    catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error', error
        })
    }
});

// Exportar configuración
module.exports = router;