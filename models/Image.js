const mongoose = require('mongoose');
const ImageSchema  = new mongoose.Schema({
    email: {type: String,required: true},
    tag: {type: String, required: true},
    filename: {type: String, required: true},
    path: {type: String, required: true},
    time: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('image',ImageSchema);