'use strict';
// Import dependencies 
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT || 3000;

// Start app
const app = express();

// Setup body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}));

// Handle sessions 
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Path to public folder 
app.use(express.static(path.join(__dirname, 'public')));

// Setup view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Create route 
app.get('/', (req, res)=> {
    res.render('index')
});

// Start server 
app.listen(PORT, () => {
    console.log('Server is running on PORT :' + PORT)
});