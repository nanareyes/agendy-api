import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: String },
  googleId: {
    type: String, required: [
      function () { return this.loginType === 'GOOGLE'; },
      'Id Google es obligatorio'
    ]
  },
  googleProfile: { type: Object },
  loginType: { type: String, required: [true, 'Tipo de login obligatorio']  },
  identification: { type: Number },
  name: { type: String, required: [true, 'Nombre obligatorio'] },
  lastName: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  city: { type: String },
  department: { type: String },
  phone: { type: Number },
  email: { type: String, required: [true, 'Email obligatorio'] },
  password: {
    type: String,
    required: [
      function () { return this.loginType === 'AGENDY'; },
      'Contraseña obligatoria'
    ]
  },
  image: { type: String },
  userType: { type: String },
  terms: { type: Boolean },
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