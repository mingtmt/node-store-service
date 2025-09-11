'use strict'

const mongoose = require('mongoose');
const { db: {host, name, port, user, pass, authSource}} = require('../configs/config.mongodb');
const { countConnect } = require('../helpers/check.connect');

const connectionString = `mongodb://${user}:${pass}@${host}:${port}/${name}?authSource=${authSource}`;

class Database {
    constructor() {
        this.connect();
    }

    // Connect to DB
    connect(type = 'mongodb'){
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }

        mongoose.connect(connectionString, {
            maxPoolSize: 50
        }).then(() => console.log('MongoDB connected', countConnect()))
            .catch(err => console.log('MongoDB connection error: ', err));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
