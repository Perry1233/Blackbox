const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./database'); // MySQL database connection pool
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup session middleware
app.use(session({
  secret: 'your_secret_key',  // Change this to a secure random key
  resave: false,
  saveUninitialized: false, // Only save sessions with data
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.patientId) {
    return next();
  } else {
    return res.status(401).send('Unauthorized: Please log in first');
  }
}

// -------------- Patient Registration -------------- 
app.post('/auth/register', async (req, res) => {
  const { first_name, email, password } = req.body;

  // Validate input
  if (!first_name || !email || !password) {
    return res.status(400).send('Please provide first_name, email, and password');
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert into the database with correct column names
    await db.query('INSERT INTO patients (first_name, email, password_hash) VALUES (?, ?, ?)', [first_name, email, hashedPassword]);
    res.status(201).send('Patient registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// -------------- Patient Login -------------- 
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send('Please provide email and password');
  }

  try {
    // Find patient by email
    const [patients] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);

    if (patients.length === 0) {
      return res.status(404).send('Patient not found');
    }

    const patient = patients[0];
    
    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, patient.password_hash);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid email or password');
    }

    // Start a session for the patient
    req.session.patientId = patient.id;
    req.session.patientName = patient.first_name; // Use first_name here

    res.json({ message: 'Login successful', patientId: patient.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// -------------- Patient Profile Management -------------- 
app.get('/auth/profile', isAuthenticated, async (req, res) => {
  const patientId = req.session.patientId;

  try {
    const [patients] = await db.query('SELECT id, first_name, email FROM patients WHERE id = ?', [patientId]);

    if (patients.length === 0) {
      return res.status(404).send('Profile not found');
    }

    const patient = patients[0];
    res.json({ id: patient.id, first_name: patient.first_name, email: patient.email });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.put('/auth/profile', isAuthenticated, async (req, res) => {
  const { first_name } = req.body; // Change from name to first_name
  const patientId = req.session.patientId;

  if (!first_name) {
    return res.status(400).send('Please provide a new first_name');
  }

  try {
    await db.query('UPDATE patients SET first_name = ? WHERE id = ?', [first_name, patientId]);
    res.send('Profile updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// -------------- Logout -------------- 
app.post('/auth/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.send('Logged out successfully');
  });
});

// -------------- Patients Routes (Protected) --------------
app.get('/patients', isAuthenticated, async (req, res) => {
  try {
    const [patients] = await db.query('SELECT id, first_name FROM patients');
    res.json(patients);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.get('/patients/:id', isAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
    const [patient] = await db.query('SELECT id, first_name FROM patients WHERE id = ?', [id]);
    if (patient.length === 0) {
      return res.status(404).send('Patient not found');
    }
    res.json(patient[0]);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.post('/patients', isAuthenticated, async (req, res) => {
  const { first_name, email } = req.body;
  try {
    const result = await db.query('INSERT INTO patients (first_name, email) VALUES (?, ?)', [first_name, email]);
    res.status(201).send(`Patient created with ID: ${result.insertId}`);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.put('/patients/:id', isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const { first_name } = req.body;

  try {
    await db.query('UPDATE patients SET first_name = ? WHERE id = ?', [first_name, id]);
    res.send(`Updated patient with ID: ${id}`);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.delete('/patients/:id', isAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM patients WHERE id = ?', [id]);
    res.send(`Deleted patient with ID: ${id}`);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// -------------- Doctors Routes (Unprotected) --------------
app.get('/doctors', (req, res) => {
  res.send('Retrieve all doctors');
});

app.get('/doctors/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Retrieve doctor with ID: ${id}`);
});

app.post('/doctors', (req, res) => {
  res.send('Create a new doctor');
});

app.put('/doctors/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Update doctor with ID: ${id}`);
});

app.delete('/doctors/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Delete doctor with ID: ${id}`);
});

// -------------- Appointments Routes (Protected) --------------
app.get('/appointments', isAuthenticated, (req, res) => {
  res.send('Retrieve all appointments');
});

app.get('/appointments/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  res.send(`Retrieve appointment with ID: ${id}`);
});

app.post('/appointments', isAuthenticated, async (req, res) => {
  const { doctor_id, appointment_date, appointment_time } = req.body;
  const patientId = req.session.patientId;

  try {
    await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
      [patientId, doctor_id, appointment_date, appointment_time, 'pending']
    );
    res.status(201).send('Appointment booked successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.put('/appointments/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  res.send(`Update appointment with ID: ${id}`);
});

app.delete('/appointments/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;
  res.send(`Delete appointment with ID: ${id}`);
});

// -------------- Admin Routes (Unprotected for now, can be protected similarly) --------------
app.get('/admin', (req, res) => {
  res.send('Admin dashboard');
});

app.post('/admin/add', (req, res) => {
  res.send('Add a new admin');
});

app.delete('/admin/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Delete admin with ID: ${id}`);
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
