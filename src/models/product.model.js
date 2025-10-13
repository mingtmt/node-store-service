"use strict";

const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: String,
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
        ratingAverage: {
            type: Number,
            default: 5,
            min: [1, "Rating averages must be greater than 1"],
            max: [5, "Rating averages must be less than 5"],
            set: (val) => Math.round(val * 10) / 10,
        },
        variations: {
            type: Array,
            default: [],
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
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

// Document middleware: run before .save() and .create() ...
productSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

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

const furnitureSchema = new Schema(
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
        collection: "Furniture",
        timestamps: true,
    }
);

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronic", electronicSchema),
    clothes: model("Clothes", clothesSchema),
    furniture: model("Furniture", furnitureSchema),
};
