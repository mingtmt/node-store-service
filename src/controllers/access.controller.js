"use strict";

const AccessService = require("../services/access.service");
const { CREATED } = require("../core/success.response");

class AccessController {
    register = async (req, res, next) => {
        new CREATED({
            message: "Register user success",
            metadata: await AccessService.register(req.body),
        }).send(res);
    };
}

module.exports = new AccessController();
