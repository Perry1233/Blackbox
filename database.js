// //import package
// const mysql = require('mysql2')

// //create connection to DBMS
// const db = mysql.createConnection({
//     host: 'localhost',
//     port: '3306',
//     user: 'root', 
//     password: '123456',
//     database: 'node_express'
// })

// //connect
// db.connect( (err) => {
//     if(err){
//         console.log('Error connecting to DB: ', err.stack)
//         return;
//     }

//     console.log('Successfully connected to DB')
// })

// //export the connection
// module.exports = db


const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',  
  user: 'root',       
  password: '123456',
  database: 'node_express', 
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0       
});


module.exports = pool.promise();  

