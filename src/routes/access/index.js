"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// Register user
router.post("/register", asyncHandler(accessController.register));
// Login user
router.post("/login", asyncHandler(accessController.login));

// Authentication
router.use(authentication);
// Logout user
router.post("/logout", asyncHandler(accessController.logout));
// Handle refresh token
router.post("/refresh", asyncHandler(accessController.hanldeRefreshToken));

module.exports = router;
