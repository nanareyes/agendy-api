import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  identification: { type: Number, required: [true, 'Identificación requerida'] },
  name: { type: String, required: [true, 'Nombre obligatorio'] },
  lastname: { type: String, required: [true, 'Apellidos obligatorio'] },
  dateOfBirth: { type: Date },
  address: { type: String, required: [true, 'Dirección requerida'] },
  city: { type: String, required: [true, 'Ciudad obligatorio'] },
  department: { type: String, required: [true, 'Departamento obligatorio'] },
  phone: { type: Number, required: [true, 'teléfono requerido'] },
  email: { type: String, required: [true, 'Email obligatorio'] },
  password: { type: String, required: [true, 'Contraseña obligatoria'] },
  type: { type: String, required: [true, 'Tipo de usuario obligatorio'] },
  terms: { type: Boolean, required: [true, 'terminos obligatorios'] },
});

// Eliminar pass de respuesta JSON
userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

// Convertir a modelo
const User = mongoose.model('User', userSchema);
export default User;