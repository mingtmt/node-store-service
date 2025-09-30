'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router()

// Register user
router.post("/users/register", accessController.register)

module.exports = router