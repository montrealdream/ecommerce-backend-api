const express = require('express');
require('dotenv').config();
const app = express();


const port = process.env.DEV_APP_PORT || 3055;

const server = app.listen(port, () => {
    console.log(`Ứng dụng Ecommerce với port ${port}`);
})

process.on('SIGINT', () => {
    server.close( () => console.log('Thoát ứng dụng Ecommerce'));
    server.exit(0);
});