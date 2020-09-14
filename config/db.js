const mongo = require('mongoose');
require('dotenv').config({ path: 'var.env' });


const conectDB = async () => {
    try {
        await mongo.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('DB conectada');
    } catch (error) {
        console.log(error);
        process.exit(1); // esto detiene la aplicacion
    }

}

module.exports = conectDB;