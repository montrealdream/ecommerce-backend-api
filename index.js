// require package
const express = require('express');
require('dotenv').config();

// require route
const v1Route = require('./v1/routes/index.route.js');
// const v2Route = require('./v2/routes/index.js');
const v1ErrorRoute = require('./v1/routes/error.route.js');

// require database
const database = require('./databases/mongo.database');

// require config
const { app : { port } } = require('./config/mongoose.config');

// init app & port
const app = express();
const PORT = port || 3055;

// init middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// init database
database.connect();

// init route
v1Route(app);
// v2Route(app);

// handling error
v1ErrorRoute(app);

// server
const server = app.listen(port, () => {
    console.log(`Ứng dụng Ecommerce với port ${PORT}`);
})

process.on('SIGINT', () => {
    server.close( () => console.log('Thoát ứng dụng Ecommerce'));
    server.exit(0);
});