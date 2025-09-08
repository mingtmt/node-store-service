const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db

// define routes
app.get('/', (req, res, next) => {
    return res.status(200).json({message: "Welcome to the API"})
})

// error handling middleware

module.exports = app;
