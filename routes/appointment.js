import express from "express";
import moment from "moment";

const router = express.Router();

//importar modelo
import Appointment from "../models/appointment";
import User from "../models/user";

//Ruta para crear una nueva cita en la agenda
router.post("/", async (req, res) => {
  const body = req.body;
  let client, stylist;

  // Obtiene el usuario cliente
  try {
    client = await User.findOne({ _id: body.clientId });
  } catch (error) {
    return res.status(400).json({
      mensaje: `Ocurrió un error`,
      error,
    });
  }
  if (!client) {
    return res.status(400).json({
      mensaje: `No existe usuario con id: ${body.clientId}`,
    });
  }

  // Obtiene el usuario estilista
  try {
    stylist = await User.findOne({ _id: body.stylistId });
  } catch (error) {
    return res.status(400).json({
      mensaje: `Ocurrió un error`,
      error,
    });
  }
  if (!stylist) {
    return res.status(400).json({
      mensaje: `No existe usuario con id: ${body.stylistId}`,
    });
  }

  // Objeto para crear la cita
  const appointment = {
    clientId: client._id,
    clientName: client.name,
    clientPhone: client.phone,
    clientEmail: client.email,
    stylistId: stylist._id,
    stylistName: stylist.name,
    stylistPhone: stylist.phone,
    stylistEmail: stylist.email,
    date: body.date,
    serviceName: body.serviceName,
    servicePrice: body.servicePrice,
  };

  try {
    const appointmentDB = await Appointment.create(appointment);
    res.status(200).json(appointmentDB);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Ocurrio un error",
      error,
    });
  }
});

//Ruta para consultar las citas en un rango de fechas
// Se reciben parámetros tipo query:
// - stylistId: ID del estilista
// - clientId: ID del client
// - startDate: Fecha inicial en formato YYYYMMDD
// - endDate: Fecha final en formato YYYYMMDD
router.get("/", async (req, res) => {
  const { stylistId, clientId, startDate, endDate } = req.query;

  const mStartDate = moment(startDate, "YYYYMMDD").utc();
  const mEndDate = moment(`${endDate} 23:59:59`, "YYYYMMDD hh:mm:ss").utc();

  const query = {
    ...(stylistId ? { stylistId } : {}),
    ...(clientId ? { clientId } : {}),
    date: {
      $gte: mStartDate.toDate(),
      $lte: mEndDate.toDate(),
    },
  };
  console.info("query", query);

  try {
    const appointmentDB = await Appointment.find(query).sort({ date: 1 });
    res.status(200).json(appointmentDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Se presentó un error al consultar las citas",
      error,
    });
  }
});

// Exportar configuración
module.exports = router;
