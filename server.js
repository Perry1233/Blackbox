// const express = require('express'); // Add express
// const http = require('http')

// const server = http.createServer((request, response) => {
//     response.statusCode = 200;
//     response.setHeader('Content-Type', 'text/plain')
//     response.end('Connecting Backend');
// })

// const express = require('express'); // Add express
// const PORT = 4500;

// server.listen(PORT, () => {
//     console.log('Server is running.')
// })

// const apiRoutes = require('./path-to-your-router-file');
// app.use('/api', apiRoutes);

const express = require('express'); // Import express
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./database'); // MySQL database connection pool
const authRoutes = require('./authRoutes'); // Adjust the path if necessary

const app = express(); // Create an Express application
const PORT = 4500; // Define the port

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(session({
    secret: 'your-secret-key', // Replace with your own secret
    resave: false,
    saveUninitialized: true,
}));

// Use auth routes
app.use('/auth', authRoutes); // Use the /auth route prefix

// Test endpoint
app.get('/', (req, res) => {
    res.send('Connecting Backend');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
