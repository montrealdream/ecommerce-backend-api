const express = require('express');
require('dotenv').config();
const database = require('./databases/mongo.database');
const { app : { port } } = require('./config/mongoose.config');

const app = express();
const PORT = port || 3055;

database.connect();

// server
const server = app.listen(port, () => {
    console.log(`Ứng dụng Ecommerce với port ${PORT}`);
})

process.on('SIGINT', () => {
    server.close( () => console.log('Thoát ứng dụng Ecommerce'));
    server.exit(0);
});