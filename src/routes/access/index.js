"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();

// Register user
router.post("/users/register", asyncHandler(accessController.register));
// Login user
router.post("/users/login", asyncHandler(accessController.login));

module.exports = router;
