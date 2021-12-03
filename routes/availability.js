import express from "express";
import moment from "moment";
const router = express.Router();

//importar modelo
import Appointment from "../models/appointment";
import User from "../models/user";

//Ruta para obtener la disponibilidad de un estilista
//Recibe estos parametros:
//  year: Año de búsqueda de disponibilidad
//  month: Mes de búsqueda de disponibilidad
router.get("/:id", async (req, res) => {
  const stylistId = req.params.id;
  const { year, month, day } = req.query;
  let stylist;

  // 1. Se consulta el workingSchedule del estilista, usando el parametro id
  // Obtiene el usuario estilista
  try {
    stylist = await User.findOne({ _id: stylistId });
  } catch (error) {
    return res.status(400).json({
      mensaje: `Ocurrió un error`,
      error,
    });
  }
  if (!stylist) {
    return res.status(400).json({
      mensaje: `No existe usuario con id: ${stylistId}`,
    });
  }

  // 2. Se crea un ciclo para los dias entre startDate y endDate que coincidan
  // con los dias de trabajo del estilista
  let mStartDate;
  let mEndDate;
  if (!day) {
    mStartDate = moment({
      year,
      month: parseInt(month) - 1,
      hour: 0,
      minute: 0,
      second: 0,
    }).startOf("month");
    mEndDate = moment({
      year,
      month: parseInt(month) - 1,
      hour: 0,
      minute: 0,
      second: 0,
    })
      .endOf("month")
      .set({ hour: 0, minute: 0, second: 0 });
  } else {
    mStartDate = moment({
      year,
      month: parseInt(month) - 1,
      day,
      hour: 0,
      minute: 0,
      second: 0,
    });
    mEndDate = moment({
      year,
      month: parseInt(month) - 1,
      day,
      hour: 0,
      minute: 0,
      second: 0,
    });
  }
  //   console.log("mStartDate", mStartDate);
  //   console.log("mEndDate", mEndDate);

  const days = [];
  for (
    let day = mStartDate;
    day.diff(mEndDate, "days") <= 0;
    day.add(1, "days")
  ) {
    if (day.month() === mEndDate.month()) {
      const dayOfWeek = day.isoWeekday();
      if (
        Object.keys(stylist.workingSchedule).includes(`${dayOfWeek}`) &&
        day.diff(moment(), "days") >= 0
      ) {
        // 3. Por cada dia del ciclo, se consulta el horario de trabajo del estilista y
        // se consultan las citas que tenga asignadas para ese dia
        let hours = [];
        stylist.workingSchedule[dayOfWeek].forEach((hourGroup) => {
          for (
            let hour = hourGroup.startHour;
            hour < hourGroup.endHour;
            hour++
          ) {
            hours.push(hour);
          }
        });
        // 4. Se crea un array de horas disponibles por cada dia utilizando la informacion
        // de las horas laborales del estilista (workingSchedule) y de las citas agendadas
        const endDay = moment(day).add(1, "day");
        const queryDay = {
          stylistId: stylist._id,
          date: {
            $gte: day.toDate(),
            $lt: endDay.toDate(),
          },
        };
        // console.log("queryDay", queryDay);
        const appointmentsForDay = await Appointment.find(queryDay).sort({
          date: 1,
        });
        const appointmentHours = appointmentsForDay.map((appointment) =>
          moment(appointment.date).utc().hour()
        );
        hours = hours.map((hour) => ({
          hour,
          available: !appointmentHours.includes(hour),
        }));
        // Determinar si hay horas disponibles para ese dia
        const availableHours = hours.filter(
          (hourRecord) => hourRecord.available
        );
        // console.log("appointmentsForDay", appointmentsForDay);
        days.push({
          day: day.toDate(),
          enabled: availableHours.length > 0,
          hours,
        });
        // console.log(day.format('YYYY-MM-DD'));
        // days.push(day.format('YYYY-MM-DD'));
      } else {
        days.push({ day: day.toDate(), enabled: false });
      }
    }
  }

  res.status(200).json({ availability: days });
});

// Exportar configuración
module.exports = router;
