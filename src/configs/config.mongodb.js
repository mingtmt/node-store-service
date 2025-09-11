const dev = {
    app: {
        port: process.env.PORT || 8006
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME || 'book-store',
        user: process.env.DB_USER || 'admin',
        pass: process.env.DB_PASS || 'secret',
        authSource: process.env.DB_AUTH_SOURCE || 'admin'
    }
};

const prod = {

};

const config = { dev, prod };
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];