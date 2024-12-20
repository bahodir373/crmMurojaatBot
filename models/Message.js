const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    username: { type: String },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
