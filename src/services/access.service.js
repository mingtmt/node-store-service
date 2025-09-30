'use strict'

const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const userRoles = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    STAFF: 'staff'
}

class AccessService {
    static register = async ({ name, email, password}) => {
        try {
            const user = await userModel.findOne({email}).lean();
            if (user) {
                return {
                    code: 'xxxx',
                    message: 'User already exists',
                }
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = await userModel.create({name, email, password: passwordHash, roles: [userRoles.CUSTOMER]});
            if (newUser) {
                // create public and private key
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newUser._id,
                    publicKey,
                    privateKey,
                })

                if (!keyStore) {
                    return {
                        code: 'xxxx',
                        message: 'Error creating key store',
                    }
                }

                //create token pair
                const tokens = await createTokenPair(
                    {userId: newUser._id, email},
                    publicKey,
                    privateKey,
                );
                console.log("created tokens: ", tokens);

                return {
                    code: 201,
                    metadata: {
                        user: getInfoData({
                            fields: ['_id', 'name', 'email' ],
                            object: newUser,
                        }),
                        tokens,
                    }
                }
            }

            return {
                code: 200,
                metadata: null,
            }

        } catch (err) {
            return {
                code: 'xxx',
                message: err.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService