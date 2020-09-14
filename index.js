const express = require('express');
const conectDB = require('./config/db');
const routes = require('./routes');
const cors = require('cors');

//create server
const app = express();

//connect with Database mongoDBAtlas
conectDB();

//Enable cors with project
app.use(cors());

//Enable express.json
app.use(express.json());

//Create port with server
const port = process.env.port || 4900;

// Route's 
app.use('/api/nodeSend', routes());

//run server
app.listen(port, '0.0.0.0',() => {
    console.log(`el servidor esta funcionando en el puerto ${port}`);
});

