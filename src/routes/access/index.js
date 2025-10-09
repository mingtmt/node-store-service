"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// Register user
router.post("/users/register", asyncHandler(accessController.register));
// Login user
router.post("/users/login", asyncHandler(accessController.login));

// Authentication
router.use(authentication);
// Logout user
router.post("/users/logout", asyncHandler(accessController.logout));

module.exports = router;
