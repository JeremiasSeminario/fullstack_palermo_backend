const mongoose = require('mongoose');
const CONFIG = require('./config');

let connection = null;

module.exports = {
    connect: () => {
        if (connection) return connection;
        return mongoose.connect(CONFIG.DB).then(connect => {
            connection = connect;
            console.log('Conexion remota a DB en MongoDB/Atlas exitosa');
        }).catch(err => console.log(err))
    }
}