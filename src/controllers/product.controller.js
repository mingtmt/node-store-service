"use strict";

const { CREATED } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
    createProduct = async (req, res, next) => {
        new CREATED({
            message: "Create product success",
            metadata: await ProductFactory.createProduct(req.body.type, {
                ...req.body,
                shop: req.user.userId,
            }),
        }).send(res);
    };
}

module.exports = new ProductController();
