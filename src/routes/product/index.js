"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// Authentication
router.use(authentication);
// Create product
router.post("/create", asyncHandler(productController.createProduct));
// Get all drafts for shop
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));

module.exports = router;
