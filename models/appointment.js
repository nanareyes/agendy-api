import mongoose from "mongoose";
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  id: { type: String },
  clientId: { type: String },
  clientName: { type: String },
  clientEmail: { type: String },
  clientPhone: { type: String },
  stylistId: { type: String },
  stylistName: { type: String },
  stylistEmail: { type: String },
  stylistPhone: { type: String },
  date: { type: Date },
  serviceName: { type: String },
  servicePrice: { type: String },
});

// Convertir a modelo
const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
