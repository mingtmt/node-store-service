"use strict";

const AccessService = require("../services/access.service");
const { SuccessResponse, CREATED } = require("../core/success.response");

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res);
    }

    register = async (req, res, next) => {
        new CREATED({
            message: "Register user success",
            metadata: await AccessService.register(req.body),
        }).send(res);
    };
}

module.exports = new AccessController();
