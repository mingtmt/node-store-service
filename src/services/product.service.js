"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, electronic, clothes } = require("../models/product.model");

class ProductFactory {
    static createProduct = async (type, payload) => {
        switch (type) {
            case "Electronic":
                return new Electronic(payload).createProduct();
            case "Clothes":
                return new Clothes(payload).createProduct();
            default:
                throw new BadRequestError(
                    `Error: Product type ${type} not found`
                );
        }
    };
}

class Product {
    constructor({
        name,
        thumbnail,
        description,
        price,
        quantity,
        type,
        shop,
        attributes,
    }) {
        this.name = name;
        this.thumbnail = thumbnail;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.type = type;
        this.shop = shop;
        this.attributes = attributes;
    }

    async createProduct() {
        return await product.create(this);
    }
}

class Clothes extends Product {
    async createProduct() {
        const newClothes = await clothes.create(this.attributes);
        if (!newClothes) {
            throw new BadRequestError("Error: Clothes not created");
        }

        const newProduct = await super.createProduct();
        if (!newProduct) {
            throw new BadRequestError("Error: Product not created");
        }

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.attributes);
        if (!newElectronic) {
            throw new BadRequestError("Error: Electronic not created");
        }

        const newProduct = await super.createProduct();
        if (!newProduct) {
            throw new BadRequestError("Error: Product not created");
        }

        return newProduct;
    }
}

module.exports = ProductFactory;
