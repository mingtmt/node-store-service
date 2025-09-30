'use strict'

const AccessService = require("../services/access.service");

class AccessController {
    register = async (req, res, next) => {
        try {
            console.log(`[P]::register:: `, req.body);
            return res.status(201).json(await AccessService.register(req.body));
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new AccessController