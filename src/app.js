require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require('./dbs/init.mongodb');
const { checkOverloadConnection } = require('./helpers/check.connect');
checkOverloadConnection();

// define routes
app.use('', require('./routes'))

// error handling middleware

module.exports = app;
