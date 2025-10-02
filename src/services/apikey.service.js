'use strict'

const apikeyModel = require("../models/apikey.model")
// const crypto = require('crypto');

const findById = async (id) => {
    // const newKey = await apikeyModel.create({
    //     key: crypto.randomBytes(64).toString('hex'),
    //     permissions: ["0000"],
    // })
    // console.log(newKey);
    const objKey = await apikeyModel.findOne({ key: id, status: true }).lean();
    return objKey;
}

module.exports = {
    findById,
}
