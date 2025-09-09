'use strict'

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

const connectionString = `mongodb://admin:secret@localhost:27017/book-store?authSource=admin`;

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
