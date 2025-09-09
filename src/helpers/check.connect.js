'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

// Count DB connections
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of MongoDB connections: ${numConnections}`);
}

// Check overload connection
const checkOverloadConnection = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        const maxConnections = numCores * 5;

        console.log('Active connections:', numConnections);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        if (numConnections > maxConnections) {
            console.warn('Connection overload detected!');
        }
    }, 5000); // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverloadConnection,
};
