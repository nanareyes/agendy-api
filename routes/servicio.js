import express from "express";
const router = express.Router();

//importar modelo
import Servicio from "../models/servicio";

//Ruta para consultar todos los servicios
router.get('/servicios', async(req,res)=> {
    try {
        const servicioDB = await Servicio.find();
        res.json(servicioDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Se presentó un error al consultar los servicios',
            error
        })
    }
});
// Ruta para consultar un servicio
router.get('/servicio/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const servicioDB = await Servicio.findOne({ _id });
        res.json(servicioDB);
    }
    catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});
// Ruta para crear un nuevo servicio
router.post('/nuevo-servicio', async (req, res) => {
    const body = req.body;

    try {
        const servicioDB = await Servicio.create(body);
        res.status(200).json(servicioDB);
    }
    catch (error) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});
// Delete eliminar un servicio
router.delete('/servicio/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const servicioDB = await Servicio.findByIdAndDelete({ _id });
        if (!servicioDB) {
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        res.json(servicioDB);
    }
    catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

// Put actualizar un servicio
router.put('/servicio/:id', async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
        const servicioDB = await Servicio.findByIdAndUpdate(
            _id, body, { new: true });
        res.json(servicioDB);
    }
    catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error', error
        })
    }
});

// Exportar configuración
module.exports = router;