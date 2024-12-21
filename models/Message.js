const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
	},
	username: {
		type: String,
		default: 'Anonim',
	},
	message: {
		type: String,
		required: true,
	},
})

module.exports = mongoose.model('Message', messageSchema)
