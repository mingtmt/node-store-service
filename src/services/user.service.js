"use strict";

const userModel = require("../models/user.model");

class UserService {
    static findByEmail = async ({
        email,
        select = {
            name: 1,
            email: 1,
            password: 1,
            status: 1,
            roles: 1,
        },
    }) => {
        return await userModel.findOne({ email }).select(select).lean();
    };
}

module.exports = UserService;
