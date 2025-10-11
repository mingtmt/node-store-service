"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check api key
router.use(apiKey);
// check permission
router.use(permission("0000"));

router.use("/api/v1/access", require("./access"));
router.use("/api/v1/products", require("./product"));

module.exports = router;
