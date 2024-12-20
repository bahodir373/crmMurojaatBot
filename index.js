require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')
const Message = require('./models/Message')

const token = process.env.BOT_TOKEN
const mongoUri = process.env.MONGODB_URI

mongoose
	.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.error('MongoDB connection error:', err))

const bot = new TelegramBot(token, { polling: true })

bot.on('message', async msg => {
	const { id: userId, username } = msg.from
	const text = msg.text
	const chatId = msg.chat.id

	try {
		if (text === '/start') {
			return bot.sendMessage(
				chatId,
				`Assalomu alaykum ${msg.from.first_name}! Bu yerga murojaatingizni yozishingiz mumkin.`
			)
		} else {
			if (text.length < 20) {
				return bot.sendMessage(
					chatId,
					`Iltimos murojaatingizni to'liqroq yozing`
				)
			} else {
				const newMessage = new Message({
					userId,
					username: username || 'Anonymous',
					message: text,
				})
				await newMessage.save()

				bot.sendMessage(msg.chat.id, 'Murojaatingiz saqlandi!')
			}
		}
	} catch (error) {
		console.error('Error saving message:', error)
		bot.sendMessage(msg.chat.id, "Xatolik yuz berdi, qayta urinib ko'ring.")
	}
})

console.log('Bot is running...')
