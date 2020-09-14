const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registry: {
        type: Date,
        default: Date.now()
    },
});

//Mongoose's definition file. NOT your model files
//mongoose.pluralize(null);
module.exports = mongoose.model('Users', UsersSchema);