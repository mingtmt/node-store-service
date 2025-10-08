'use strict'

const AccessService = require("../services/access.service");

class AccessController {
    register = async (req, res, next) => {
        return res.status(201).json(await AccessService.register(req.body));
    }
}

module.exports = new AccessController