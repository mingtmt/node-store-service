"use strict";

const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADERS = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESH_TOKEN: "x-refresh-token",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: "30 minutes",
        });

        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: "7 days",
        });

        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log("access token invalid: ", err);
            } else {
                console.log("decode access token: ", decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (err) {}
};

const authentication = asyncHandler(async (req, res, next) => {
    // 1 - check userId is missing
    const userId = req.headers[HEADERS.CLIENT_ID];
    if (!userId) {
        throw new AuthFailureError("Error: Authentication error");
    }

    // 2 - get access token
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError("Error: key store not found");
    }

    // 3 - verify access token
    if (req.headers[HEADERS.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
            const decoded = jwt.verify(refreshToken, keyStore.privateKey);
            if (userId !== decoded.userId) {
                throw new AuthFailureError("Error: Invalid token");
            }
            req.keyStore = keyStore;
            req.user = decoded;
            req.refreshToken = refreshToken;
            return next();
        } catch (err) {
            throw err;
        }
    }
});

const verifyJWT = async (token, keySecret) => {
    return await jwt.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
};
