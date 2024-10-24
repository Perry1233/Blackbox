// const express = require('express');
// const db = require('./database'); // MySQL database connection pool
// const router = express.Router();

// // -------------- Patient Management ---------------------
// // List all patients (Admin only)
// router.get('/patients', async (req, res) => {
//   try {
//     const [patients] = await db.query('SELECT * FROM patients');
//     res.status(200).json(patients);
//   } catch (error) {
//     console.log('Error retrieving patients:', error);
//     res.status(500).send('Error retrieving patients');
//   }
// });

// // Delete patient account
// router.delete('/patients/:id', async (req, res) => {
//   const patientId = req.params.id;

//   try {
//     await db.query('DELETE FROM patients WHERE id = ?', [patientId]);
//     res.status(200).send('Patient account deleted successfully');
//   } catch (error) {
//     console.log('Error deleting patient:', error);
//     res.status(500).send('Error deleting patient');
//   }
// });

// // --------------------- Doctor Management ---------------------
// // Create a new doctor (Admin only)
// router.post('/doctors', async (req, res) => {
//   const { name, specialization, availability } = req.body;

//   const sql = `INSERT INTO doctors (name, specialization, availability)
//                VALUES (?, ?, ?)`;

//   try {
//     await db.query(sql, [name, specialization, availability]);
//     res.status(201).send('Doctor added successfully');
//   } catch (error) {
//     console.log('Error adding doctor:', error);
//     res.status(500).send('Error adding doctor');
//   }
// });

// // List all doctors
// router.get('/doctors', async (req, res) => {
//   try {
//     const [doctors] = await db.query('SELECT * FROM doctors');
//     res.status(200).json(doctors);
//   } catch (error) {
//     console.log('Error retrieving doctors:', error);
//     res.status(500).send('Error retrieving doctors');
//   }
// });

// // Update doctor profile
// router.put('/doctors/:id', async (req, res) => {
//   const doctorId = req.params.id;
//   const { name, specialization, availability } = req.body;

//   const sql = `UPDATE doctors 
//                SET name = ?, specialization = ?, availability = ?
//                WHERE id = ?`;

//   try {
//     await db.query(sql, [name, specialization, availability, doctorId]);
//     res.status(200).send('Doctor updated successfully');
//   } catch (error) {
//     console.log('Error updating doctor:', error);
//     res.status(500).send('Error updating doctor');
//   }
// });

// // Delete doctor profile
// router.delete('/doctors/:id', async (req, res) => {
//   const doctorId = req.params.id;

//   try {
//     await db.query('DELETE FROM doctors WHERE id = ?', [doctorId]);
//     res.status(200).send('Doctor account deleted successfully');
//   } catch (error) {
//     console.log('Error deleting doctor:', error);
//     res.status(500).send('Error deleting doctor');
//   }
// });

// // --------------------- Appointment Management ---------------------
// // Book a new appointment
// router.post('/appointments', async (req, res) => {
//   const { patient_id, doctor_id, date, time } = req.body;

//   const sql = `INSERT INTO appointments (patient_id, doctor_id, date, time)
//                VALUES (?, ?, ?, ?)`;

//   try {
//     await db.query(sql, [patient_id, doctor_id, date, time]);
//     res.status(201).send('Appointment booked successfully');
//   } catch (error) {
//     console.log('Error booking appointment:', error);
//     res.status(500).send('Error booking appointment');
//   }
// });

// // List all appointments for a patient or doctor
// router.get('/appointments', async (req, res) => {
//   try {
//     const [appointments] = await db.query('SELECT * FROM appointments');
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.log('Error retrieving appointments:', error);
//     res.status(500).send('Error retrieving appointments');
//   }
// });

// // Update appointment details
// router.put('/appointments/:id', async (req, res) => {
//   const appointmentId = req.params.id;
//   const { date, time } = req.body;

//   const sql = `UPDATE appointments 
//                SET date = ?, time = ?
//                WHERE id = ?`;

//   try {
//     await db.query(sql, [date, time, appointmentId]);
//     res.status(200).send('Appointment updated successfully');
//   } catch (error) {
//     console.log('Error updating appointment:', error);
//     res.status(500).send('Error updating appointment');
//   }
// });

// // Cancel an appointment
// router.delete('/appointments/:id', async (req, res) => {
//   const appointmentId = req.params.id;

//   try {
//     await db.query('DELETE FROM appointments WHERE id = ?', [appointmentId]);
//     res.status(200).send('Appointment canceled successfully');
//   } catch (error) {
//     console.log('Error canceling appointment:', error);
//     res.status(500).send('Error canceling appointment');
//   }
// });

// module.exports = router;


const express = require('express');
const db = require('./database'); // MySQL database connection pool
const router = express.Router();

// -------------- Patient Management ---------------------
// List all patients (Admin only)
router.get('/patients', async (req, res) => {
  try {
    const [patients] = await db.query('SELECT * FROM patients');
    res.status(200).json(patients);
  } catch (error) {
    console.log('Error retrieving patients:', error);
    res.status(500).send('Error retrieving patients');
  }
});

// Delete patient account
router.delete('/patients/:id', async (req, res) => {
  const patientId = req.params.id;

  try {
    await db.query('DELETE FROM patients WHERE id = ?', [patientId]);
    res.status(200).send('Patient account deleted successfully');
  } catch (error) {
    console.log('Error deleting patient:', error);
    res.status(500).send('Error deleting patient');
  }
});

// --------------------- Doctor Management ---------------------
// Create a new doctor (Admin only)
router.post('/doctors', async (req, res) => {
  const { first_name, last_name, specialization, schedule } = req.body;

  const sql = `INSERT INTO doctors (first_name, last_name, specialization, schedule)
               VALUES (?, ?, ?, ?)`;

  try {
    await db.query(sql, [first_name, last_name, specialization, schedule]);
    res.status(201).send('Doctor added successfully');
  } catch (error) {
    console.log('Error adding doctor:', error);
    res.status(500).send('Error adding doctor');
  }
});

// List all doctors
router.get('/doctors', async (req, res) => {
  try {
    const [doctors] = await db.query('SELECT * FROM doctors');
    res.status(200).json(doctors);
  } catch (error) {
    console.log('Error retrieving doctors:', error);
    res.status(500).send('Error retrieving doctors');
  }
});

// Update doctor profile and schedule
router.put('/doctors/:id', async (req, res) => {
  const doctorId = req.params.id;
  const { first_name, last_name, specialization, schedule } = req.body;

  const sql = `UPDATE doctors 
               SET first_name = ?, last_name = ?, specialization = ?, schedule = ?
               WHERE id = ?`;

  try {
    await db.query(sql, [first_name, last_name, specialization, schedule, doctorId]);
    res.status(200).send('Doctor updated successfully');
  } catch (error) {
    console.log('Error updating doctor:', error);
    res.status(500).send('Error updating doctor');
  }
});

// Delete doctor profile
router.delete('/doctors/:id', async (req, res) => {
  const doctorId = req.params.id;

  try {
    await db.query('DELETE FROM doctors WHERE id = ?', [doctorId]);
    res.status(200).send('Doctor account deleted successfully');
  } catch (error) {
    console.log('Error deleting doctor:', error);
    res.status(500).send('Error deleting doctor');
  }
});

// --------------------- Appointment Management ---------------------
// Book a new appointment
router.post('/appointments', async (req, res) => {
  const { patient_id, doctor_id, date, time } = req.body;

  const sql = `INSERT INTO appointments (patient_id, doctor_id, date, time)
               VALUES (?, ?, ?, ?)`;

  try {
    await db.query(sql, [patient_id, doctor_id, date, time]);
    res.status(201).send('Appointment booked successfully');
  } catch (error) {
    console.log('Error booking appointment:', error);
    res.status(500).send('Error booking appointment');
  }
});

// List all appointments for a patient or doctor
router.get('/appointments', async (req, res) => {
  try {
    const [appointments] = await db.query('SELECT * FROM appointments');
    res.status(200).json(appointments);
  } catch (error) {
    console.log('Error retrieving appointments:', error);
    res.status(500).send('Error retrieving appointments');
  }
});

// Update appointment details
router.put('/appointments/:id', async (req, res) => {
  const appointmentId = req.params.id;
  const { date, time } = req.body;

  const sql = `UPDATE appointments 
               SET date = ?, time = ?
               WHERE id = ?`;

  try {
    await db.query(sql, [date, time, appointmentId]);
    res.status(200).send('Appointment updated successfully');
  } catch (error) {
    console.log('Error updating appointment:', error);
    res.status(500).send('Error updating appointment');
  }
});

// Cancel an appointment
router.delete('/appointments/:id', async (req, res) => {
  const appointmentId = req.params.id;

  try {
    await db.query('DELETE FROM appointments WHERE id = ?', [appointmentId]);
    res.status(200).send('Appointment canceled successfully');
  } catch (error) {
    console.log('Error canceling appointment:', error);
    res.status(500).send('Error canceling appointment');
  }
});

module.exports = router;
