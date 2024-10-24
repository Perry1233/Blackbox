const express = require('express')
const db = require('./database')

const app = express();

const port = 3600;

// TABLE CREATION

app.get('/createTable', (req, res) => {
    const sql = `
    CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NULL,
        date_of_birth DATE NULL,
        gender VARCHAR(255) NULL,
        address VARCHAR(255) NULL
    )
        `
        db.query(sql, (err) => {
            if(err){
                console.log('Error creating patients table:', err)
                return response.status(500).send('Error creating patients table')
            }
    
            res.send('patients table created succcessfully.')
        })
    })

    app.get('/createTable2', (req, res) => {
        const sql = `
        CREATE TABLE IF NOT EXISTS doctors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            specialization VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(255) NOT NULL,
           schedule DATETIME NOT NULL
        )
            `
            db.query(sql, (err) => {
                if(err){
                    console.log('Error creating doctors table:', err)
                    return response.status(500).send('Error creating doctors table')
                }
        
                res.send('doctors table created succcessfully.')
            })
        })

        app.get('/createTable3', (req, res) => {
            const sql = `
            CREATE TABLE IF NOT EXISTS appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_date DATE NOT NULL,
                appointment_time TIME NOT NULL,
                status ENUM('pending', 'completed', 'canceled', 'in-progress') NOT NULL
        );

                `
                db.query(sql, (err) => {
                    if(err){
                        console.log('Error creating appointments table:', err)
                        return response.status(500).send('Error creating appointments table')
                    }
            
                    res.send('appointments table created succcessfully.')
                })
            })

        
        app.get('/createTable4', (req, res) => {
            const sql = `
            CREATE TABLE IF NOT EXISTS admin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user', 'guest') NOT NULL
        );

                `
                db.query(sql, (err) => {
                    if(err){
                        console.log('Error creating admin table:', err)
                        return response.status(500).send('Error creating admin table')
                    }
            
                    res.send('admin table created succcessfully.')
                })
            })

            // RELATIONSHIPS

            // app.get('/createTable', (req, res) => {
            //     const sql = `
            //     CREATE TABLE IF NOT EXISTS patients (
            //       id INT AUTO_INCREMENT PRIMARY KEY,
            //       first_name VARCHAR(255) NOT NULL,
            //       last_name VARCHAR(255) NOT NULL,
            //       email VARCHAR(255) NOT NULL,
            //       password_hash VARCHAR(255) NOT NULL,
            //       phone VARCHAR(255) NOT NULL,
            //       date_of_birth DATE NOT NULL,
            //       gender VARCHAR(255) NOT NULL,
            //       address VARCHAR(255) NOT NULL
            //     )
            //     `;
              
            //     db.query(sql, (err) => {
            //       if (err) {
            //         console.log('Error creating patients table:', err);
            //         return response.status(500).send('Error creating patients table');
            //       }
              
            //       res.send('patients table created successfully.');
            //     });
            //   });
              
            //   app.get('/createTable2', (req, res) => {
            //     const sql = `
            //     CREATE TABLE IF NOT EXISTS doctors (
            //       id INT AUTO_INCREMENT PRIMARY KEY,
            //       first_name VARCHAR(255) NOT NULL,
            //       last_name VARCHAR(255) NOT NULL,
            //       specialization VARCHAR(255) NOT NULL,
            //       email VARCHAR(255) NOT NULL,
            //       phone VARCHAR(255) NOT NULL,
            //       schedule DATETIME NOT NULL
            //     )
            //     `;
              
            //     db.query(sql, (err) => {
            //       if (err) {
            //         console.log('Error creating doctors table:', err);
            //         return response.status(500).send('Error creating doctors table');
            //       }
              
            //       res.send('doctors table created successfully.');
            //     });
            //   });
              
              app.get('/createTable3', (req, res) => {
                const sql = `
                CREATE TABLE IF NOT EXISTS appointments (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  patient_id INT NOT NULL,
                  doctor_id INT NOT NULL,
                  appointment_date DATE NOT NULL,
                  appointment_time TIME NOT NULL,
                  status ENUM('pending', 'completed', 'canceled', 'in-progress') NOT NULL,
                  FOREIGN KEY (patient_id) REFERENCES patients(id),
                  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
                )
                `;
              
                db.query(sql, (err) => {
                  if (err) {
                    console.log('Error creating appointments table:', err);
                    return response.status(500).send('Error creating appointments table');
                  }
              
                  res.send('appointments table created successfully.');
                });
              });
              
              // app.get('/createTable4', (req, res) => {
              //   const sql = `
              //   CREATE TABLE IF NOT EXISTS admin (
              //     id INT AUTO_INCREMENT PRIMARY KEY,
              //     username VARCHAR(255) NOT NULL,
              //     password_hash VARCHAR(255) NOT NULL,
              //     role ENUM('admin', 'user', 'guest') NOT NULL
              //   )
              //   `;
              
              //   db.query(sql, (err) => {
              //     if (err) {
              //       console.log('Error creating admin table:', err);
              //       return response.status(500).send('Error creating admin table');
              //     }
              
              //     res.send('admin table created successfully.');
              //   });
              // });

            //   SAMPLE DATA

app.get('/createUser', (req, res) => {
    const sql = `
    INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address)
VALUES
  ('John', 'Doe', 'johndoe@example.com', 'hashed_password', '1234567890', '1990-01-01', 'Male', '123 Main Street'),
  ('Jane', 'Smith', 'janesmith@example.com', 'hashed_password2', '9876543210', '1995-02-02', 'Female', '456 Oak Avenue');
    `
    db.query(sql, (err) => {
        if(err){
            console.log('Error creating patients record:', err)
            return response.status(500).send('Error creating patients record')
        }

        res.send('patients record created succcessfully.')
    })
})


app.get('/createUser2', (req, res) => {
    const sql = `
   INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule)
VALUES
  ('Dr. David', 'Johnson', 'Cardiologist', 'davidjohnson@example.com', '5555555555', '2024-10-11 10:00:00'),
  ('Dr. Sarah', 'Lee', 'Pediatrician', 'sarahlee@example.com', '6666666666', '2024-10-12 14:00:00');
    `
    db.query(sql, (err) => {
        if(err){
            console.log('Error creating doctors record:', err)
            return response.status(500).send('Error creating doctors record')
        }

        res.send('doctors record created succcessfully.')
    })
})


app.get('/createUser3', (req, res) => {
    const sql = `
    INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status)
VALUES
  (1, 1, '2024-10-15', '11:00:00', 'pending'),
  (2, 2, '2024-10-16', '15:00:00', 'pending');
    `
    db.query(sql, (err) => {
        if(err){
            console.log('Error creating appointments record:', err)
            return response.status(500).send('Error creating appointments record')
        }

        res.send('appointments record created succcessfully.')
    })
})


app.get('/createUser4', (req, res) => {
    const sql = `
   INSERT INTO admin (username, password_hash, role)
VALUES
  ('admin', 'hashed_admin_password', 'admin');
    `
    db.query(sql, (err) => {
        if(err){
            console.log('Error creating admin record:', err)
            return response.status(500).send('Error creating admin record')
        }

        res.send('admin record created succcessfully.')
    })
})


app.get('/', (req, res) => {
    res.status(200).send('Hello, you are now using the express package.')
})
     
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
    })