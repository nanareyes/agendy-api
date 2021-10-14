import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const servicioSchema = new Schema({
    nombre: {type: String, required: [true, 'Nombre obligatorio']},
    descripcion: String,
    precio: {type: Number, required: [true, 'precio requerido']},
    imagen: String, 
});


// Convertir a modelo
const Servicio = mongoose.model('Servicio', servicioSchema);
export default Servicio;