import express from "express";
import moment from "moment";
const router = express.Router();

//importar modelo
import Appointment from "../models/appointment";
import User from "../models/user";

//Ruta para obtener la disponibilidad de un estilista
//Recibe estos parametros:
//  startDate: fecha inicial de disponibilidad
//  endDate: fecha final de disponibilidad
router.get('/:id', async (req, res) => {
    const stylistId = req.params.id;
    const {startDate, endDate} = req.query;
    let stylist
    
    // 1. Se consulta el workingSchedule del estilista, usando el parametro id
    // Obtiene el usuario estilista
    try {
        stylist = await User.findOne({ _id: stylistId });
    }
    catch (error) {
        return res.status(400).json({
            mensaje: `Ocurrió un error`,
            error
        })
    }
    if (!stylist) {
        return res.status(400).json({
            mensaje: `No existe usuario con id: ${stylistId}`
        })
    }

    // 2. Se crea un ciclo para los dias entre startDate y endDate que coincidan
    // con los dias de trabajo del estilista
    const mStartDate = moment(startDate).utc();
    const mEndDate = moment(endDate).utc();

    const days = [];
    for (let day = mStartDate; day.diff(mEndDate, 'days') <= 0; day.add(1, 'days')) {
        const dayOfWeek = day.isoWeekday();
        if (Object.keys(stylist.workingSchedule).includes(`${dayOfWeek}`)) {
            // 3. Por cada dia del ciclo, se consulta el horario de trabajo del estilista y
            // se consultan las citas que tenga asignadas para ese dia
            let hours = []
            stylist.workingSchedule[dayOfWeek].forEach(hourGroup => {
                for (let hour = hourGroup.startHour; hour < hourGroup.endHour; hour++) {
                    hours.push(hour);
                }
            });
            // 4. Se crea un array de horas disponibles por cada dia utilizando la informacion
            // de las horas laborales del estilista (workingSchedule) y de las citas agendadas
            const endDay = moment(day).add(1, 'day')
            const queryDay = {
                stylistId: stylist.id,
                date: {
                    $gte: day.toDate(),
                    $lt: endDay.toDate()
                }
            };
            const appointmentsForDay = await Appointment.find(queryDay)
            console.log("appointmentsForDay", appointmentsForDay);
            days.push({day: day.format('YYYY-MM-DD'), hours });
            // console.log(day.format('YYYY-MM-DD'));
            // days.push(day.format('YYYY-MM-DD'));
        }
    }


    res.status(200).json({days});

});


// Exportar configuración
module.exports = router;