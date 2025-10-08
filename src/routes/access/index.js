"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();

// Register user
router.post("/users/register", asyncHandler(accessController.register));

module.exports = router;
