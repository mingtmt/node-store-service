"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const UserSevice = require("./user.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./user.service");

const userRoles = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    STAFF: "staff",
};

class AccessService {
    static handleRefreshToken = async (refreshToken) => {
        // 1 - check refresh token in db
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            // 2 - decode refresh token to get userId
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log("userId: ", userId);
            console.log("email: ", email);

            await KeyTokenService.removeKeyByUserId(userId);
            throw new ForbiddenError("Error: Something went wrong");
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) {
            throw new AuthFailureError("Error: Refresh token not found");
        }
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
        console.log("userId: ", userId);
        console.log("email: ", email);

        const foundUser = await UserSevice.findByEmail({ email });
        if (!foundUser) {
            throw new AuthFailureError("Error: User not found");
        }

        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey);

        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            }
        })

        return {
            user: { userId, email },
            tokens,
        }
    }

    static logout = async (keyStore) => {
        return await KeyTokenService.removeKeyById(keyStore._id);
    }

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
