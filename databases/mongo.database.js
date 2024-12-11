const mongoose = require('mongoose');
const { db : { host, port, name }} = require('../config/mongoose.config');

// Mongo URL
const MONGO_URL = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor () {
        this.connect();
    }

    async connect (type = 'mongodb') {
        
        // set mongoose Debug nếu ở môi trường dev
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        await mongoose.connect(MONGO_URL)
            .then( () =>  console.log('Database: Kết nối MongoDB thành công'))
            .catch( (error) => console.log(`Database: Kết nối MongoDB thất bại`))

    }

    static getInstance () {
        if(Database.instance === undefined) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

module.exports.connect = () => {
    const instance = Database.getInstance();
}