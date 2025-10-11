"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        description: String,
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["Electronic", "Clothes", "Furniture"],
        },
        shop: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

const electronicSchema = new Schema(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        model: String,
        color: String,
        shop: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        collection: "Electronic",
        timestamps: true,
    }
);

const clothesSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        shop: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        collection: "Clothes",
        timestamps: true,
    }
);

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronic", electronicSchema),
    clothes: model("Clothes", clothesSchema),
};
