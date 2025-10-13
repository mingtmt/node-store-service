"use strict";

const {
    product,
    electronic,
    clothes,
    furniture,
} = require("../models/product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate("shop", "name email -_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

module.exports = {
    findAllDraftsForShop,
};
