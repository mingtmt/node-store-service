'use strict'

const jwt = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: '30 minutes',
        });

        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('access token invalid: ', err);
            } else {
                console.log('decode access token: ', decode);
            }
        });

        return { accessToken, refreshToken }
    } catch (err) {

    }
}

module.exports = {
    createTokenPair,
}