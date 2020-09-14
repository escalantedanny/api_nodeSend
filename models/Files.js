const mongoose = require('mongoose');
const FilesSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    name_origin: {
        type: String,
        required: true
    },
    downloads: {
        type: Number,
        default : 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    registry: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('File', FilesSchema);