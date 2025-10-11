"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // });

            // return tokens ? tokens.publicKey : null;

            // high level
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken,
            };
            const options = { upsert: true, new: true };

            const tokens = await keytokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );

            return tokens ? tokens.publicKey : null;
        } catch (err) {
            return err;
        }
    };

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: userId }).lean();
    };

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken}).lean();
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken });
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: id });
    };

    static removeKeyByUserId = async (userId) => {
        return await keytokenModel.deleteOne({user: userId})
    }
}

module.exports = KeyTokenService;
