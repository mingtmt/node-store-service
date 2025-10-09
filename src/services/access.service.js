"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./user.service");

const userRoles = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    STAFF: "staff",
};

class AccessService {
    /*
        1 - check email in db
        2 - check password
        3 - create publicKet and privateKey store in db
        4 - generate tokens
        5 - get data return client
    */
    static login = async ({ email, password, refreshToken = null }) => {
        // 1 - check email in db
        const foundUser = await findByEmail({ email });
        if (!foundUser) {
            throw new BadRequestError("Error: User not registered");
        }

        // 2 - check password
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            throw new AuthFailureError("Error: Authentication error");
        }

        // 3 - create accessToken and refreshToken store in db
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // 4 - generate tokens
        const tokens = await createTokenPair(
            { userId: foundUser._id, email },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        // 5 - get data return client
        return {
            user: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundUser,
            }),
            tokens,
        };
    };

    static register = async ({ name, email, password }) => {
        const user = await userModel.findOne({ email }).lean();
        if (user) {
            throw new BadRequestError("Error: User already registered");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email,
            password: passwordHash,
            roles: [userRoles.CUSTOMER],
        });
        if (newUser) {
            // create public and private key
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
                privateKey,
            });

            if (!keyStore) {
                throw new BadRequestError("Error: Key store error");
            }

            //create token pair
            const tokens = await createTokenPair(
                { userId: newUser._id, email },
                publicKey,
                privateKey
            );
            console.log("created tokens: ", tokens);

            return {
                code: 201,
                metadata: {
                    user: getInfoData({
                        fields: ["_id", "name", "email"],
                        object: newUser,
                    }),
                    tokens,
                },
            };
        }

        return {
            code: 200,
            metadata: null,
        };
    };
}

module.exports = AccessService;
