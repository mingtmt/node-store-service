"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, electronic, clothes, furniture } = require("../models/product.model");
const { findAllDraftsForShop } = require("../repositories/product.repo");

class ProductFactory {
    static productRegistry = {};

    static registerProductType (type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static createProduct = async (type, payload) => {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError("Error: Product type not found");
        }

        return new productClass(payload).createProduct();
    };

    static findAllDraftsForShop = async ({shop, limit = 50, skip = 0}) => {
        const query = { shop, isDraft: true };
        return await findAllDraftsForShop({query, limit, skip});
    }
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

    async createProduct(id) {
        return await product.create({ ...this, _id: id });
    }
}

class Clothes extends Product {
    async createProduct() {
        const newClothes = await clothes.create({
            ...this.attributes,
            shop: this.shop,
        });
        if (!newClothes) {
            throw new BadRequestError("Error: Clothes not created");
        }

        const newProduct = await super.createProduct(newClothes._id);
        if (!newProduct) {
            throw new BadRequestError("Error: Product not created");
        }

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.attributes,
            shop: this.shop,
        });
        if (!newElectronic) {
            throw new BadRequestError("Error: Electronic not created");
        }

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) {
            throw new BadRequestError("Error: Product not created");
        }

        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.attributes,
            shop: this.shop,
        });
        if (!newFurniture) {
            throw new BadRequestError("Error: Furniture not created");
        }

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) {
            throw new BadRequestError("Error: Furniture not created");
        }

        return newProduct;
    }
}

ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothes", Clothes);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
