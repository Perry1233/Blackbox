// const express = require('express');
// const bcrypt = require('bcrypt');
// const session = require('express-session');
// const db = require('./database'); // MySQL database connection pool
// const router = express.Router(); // Use the Router to define routes

// // -------------- Patient Registration -------------- 
// router.post('/register', async (req, res) => {
//   const { first_name, email, password } = req.body;

//   // Validate input
//   if (!first_name || !email || !password) {
//     return res.status(400).send('Please provide first_name, email, and password');
//   }

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // Insert into the database with correct column names
//     await db.query('INSERT INTO patients (first_name, email, password_hash) VALUES (?, ?, ?)', [first_name, email, hashedPassword]);
//     res.status(201).send('Patient registered successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });

// // -------------- Patient Login -------------- 
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   console.log('Login attempt with email:', email); // Debug

//   if (!email || !password) {
//     return res.status(400).send('Please provide email and password');
//   }

//   try {
//     const [patients] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
//     console.log('Patient query result:', patients); // Debug

//     if (patients.length === 0) {
//       return res.status(404).send('Patient not found');
//     }

//     const patient = patients[0];
//     const isPasswordValid = await bcrypt.compare(password, patient.password_hash);
//     console.log('Password valid:', isPasswordValid); // Debug

//     if (!isPasswordValid) {
//       return res.status(401).send('Invalid email or password');
//     }

//     req.session.patientId = patient.id;
//     req.session.patientName = patient.first_name;
//     res.json({ message: 'Login successful', patientId: patient.id });
//   } catch (error) {
//     console.error('Login error:', error); // Debug
//     res.status(500).send('Server error');
//   }
// });

// // -------------- Middleware to Check Authentication -------------- 
// const authenticate = (req, res, next) => {
//   if (!req.session.patientId) {
//     return res.status(401).send('Unauthorized: Please log in first');
//   }
//   next();
// };

// // -------------- Patient Profile Management -------------- 
// router.get('/profile', authenticate, async (req, res) => {
//   const patientId = req.session.patientId;

//   try {
//     const [patients] = await db.query('SELECT id, first_name, email FROM patients WHERE id = ?', [patientId]);

//     if (patients.length === 0) {
//       return res.status(404).send('Profile not found');
//     }

//     const patient = patients[0];
//     res.json({ id: patient.id, first_name: patient.first_name, email: patient.email });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });

// router.put('/profile', authenticate, async (req, res) => {
//   const { first_name } = req.body; // Change from name to first_name
//   const patientId = req.session.patientId;

//   if (!first_name) {
//     return res.status(400).send('Please provide a new first_name');
//   }

//   try {
//     await db.query('UPDATE patients SET first_name = ? WHERE id = ?', [first_name, patientId]);
//     res.send('Profile updated successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });

// // -------------- Logout -------------- 
// router.post('/logout', authenticate, (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).send('Error logging out');
//     }
//     res.send('Logged out successfully');
//   });
// });


// module.exports = router;


const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./database'); // MySQL database connection pool
const router = express.Router(); // Use the Router to define routes

// ------------------ Session Configuration ------------------
const app = express(); // Ensure app is defined at the top level
app.use(express.json()); // Ensure we can parse JSON in request bodies

app.use(session({
    secret: 'your-secret-key', // Replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// ----------------- Patient Management ------------------

// -------------- Patient Registration --------------
router.post('/register', async (req, res) => {
    const { first_name, email, password } = req.body;

    if (!first_name || !email || !password) {
        return res.status(400).send('Please provide first_name, email, and password');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO patients (first_name, email, password_hash) VALUES (?, ?, ?)', 
                       [first_name, email, hashedPassword]);
        res.status(201).send('Patient registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// -------------- Patient Login --------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please provide email and password');
    }

    try {
        const [patients] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);

        if (patients.length === 0) {
            return res.status(404).send('Patient not found');
        }

        const patient = patients[0];
        const isPasswordValid = await bcrypt.compare(password, patient.password_hash);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid email or password');
        }

        req.session.patientId = patient.id;
        req.session.patientName = patient.first_name;
        res.json({ message: 'Login successful', patientId: patient.id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
});

// -------------- Middleware to Check Authentication --------------
const authenticate = (req, res, next) => {
    if (!req.session.patientId) {
        return res.status(401).send('Unauthorized: Please log in first');
    }
    next();
};

// -------------- Patient Profile Management --------------
router.get('/profile', authenticate, async (req, res) => {
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

router.put('/profile', authenticate, async (req, res) => {
    const { first_name } = req.body;
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
router.post('/logout', authenticate, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.send('Logged out successfully');
    });
});

// ------------------ Doctor Management ------------------

// Middleware to authenticate admin (simplified for demonstration)
const authenticateAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    return res.status(401).send('Unauthorized: Admin access only');
};

// -------------- Create Doctor (Admin Only) --------------
router.post('/doctors', authenticateAdmin, async (req, res) => {
    const { first_name, last_name, email, specialization, schedule } = req.body;

    if (!first_name || !last_name || !email || !specialization || !schedule) {
        console.log("Missing required fields:", req.body); // Log body to see what's being sent
        return res.status(400).send('All fields are required');
    }

    try {
        const result = await db.query(
            'INSERT INTO doctors (first_name, last_name, email, specialization, schedule) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, specialization, schedule]
        );
        console.log('Doctor created:', result);
        res.status(201).send(`Doctor created with ID: ${result.insertId}`);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
    }
});

// -------------- Read Doctors (List of Doctors) --------------
router.get('/doctors', async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT id, first_name, last_name, specialization, schedule FROM doctors');
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// -------------- Update Doctor (Admin Only) --------------
router.put('/doctors/:doctorId', authenticateAdmin, async (req, res) => {
    const { doctorId } = req.params;
    const { first_name, last_name, specialization, schedule } = req.body;

    if (!first_name && !last_name && !specialization && !schedule) {
        return res.status(400).send('Provide at least one field to update');
    }

    try {
        const updateFields = [];
        const updateValues = [];

        if (first_name) {
            updateFields.push('first_name = ?');
            updateValues.push(first_name);
        }
        if (last_name) {
            updateFields.push('last_name = ?');
            updateValues.push(last_name);
        }
        if (specialization) {
            updateFields.push('specialization = ?');
            updateValues.push(specialization);
        }
        if (schedule) {
            updateFields.push('schedule = ?');
            updateValues.push(schedule);
        }

        updateValues.push(doctorId); // Append doctorId for WHERE clause

        const sql = `UPDATE doctors SET ${updateFields.join(', ')} WHERE id = ?`;
        await db.query(sql, updateValues);

        res.send('Doctor updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// -------------- Delete Doctor (Admin Only) --------------
router.delete('/doctors/:doctorId', authenticateAdmin, async (req, res) => {
    const { doctorId } = req.params;

    try {
        await db.query('DELETE FROM doctors WHERE id = ?', [doctorId]);
        res.send('Doctor deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
