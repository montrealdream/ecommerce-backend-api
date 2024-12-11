// môi trường dev
const dev = {
    app: {
        port: process.env.DEV_APP_PORT
    },
    db: {
        host: process.env.DEV_DATABASE_HOST,
        port: process.env.DEV_DATABASE_PORT,
        name: process.env.DEV_DATABASE_NAME
    }
}

// môi trường product
const product = {
    app: {
        port: process.env.PRODUCT_APP_PORT
    },
    db: {
        host: process.env.PRODUCT_DATABASE_HOST,
        port: process.env.PRODUCT_DATABASE_PORT,
        name: process.env.PRODUCT_DATABASE_NAME
    }
}

// cấu hình ứng dụng
const config = {
    'dev':  dev,
    'product':  product
}

const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];

