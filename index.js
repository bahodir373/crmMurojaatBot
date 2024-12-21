require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')
const Message = require('./models/Message')

const token = process.env.BOT_TOKEN
const mongoUri = process.env.MONGODB_URI
const adminsID = [6445758541, 6288095997, 6053902856, 5575836992, 738588309]

mongoose
	.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB ulandi'))
	.catch(err => console.error('MongoDB ulanishda xatolik:', err))

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
		} else if (text === '/get_data') {
			try {
				if (adminsID.includes(chatId)) {
					const data = await Message.find()
					if (data.length > 0) {
						const formattedData = data
							.map(
								(msg, index) =>
									`${index + 1}. ${msg.message || 'Maʼlumot yo‘q'}`
							)
							.join('\n')
						await bot.sendMessage(
							chatId,
							`Mana bazadagi maʼlumotlar:\n${formattedData}`
						)
					} else {
						await bot.sendMessage(chatId, 'Hozircha bazada maʼlumot yo‘q.')
					}
				} else{
					return bot.sendMessage(chatId, `Kechirasiz, siz admin emassiz!`)
				}
			} catch (error) {
				console.error(error)
				await bot.sendMessage(
					chatId,
					'Maʼlumotlarni olishda xatolik yuz berdi.'
				)
			}
		} else {
			if (text.length < 20) {
				return bot.sendMessage(
					chatId,
					`Iltimos, murojaatingizni to‘liqroq yozing.`
				)
			} else {
				const newMessage = new Message({
					userId,
					username: username || 'Anonim',
					message: text,
				})
				await newMessage.save()

				bot.sendMessage(chatId, 'Murojaatingiz muvaffaqiyatli saqlandi!')
			}
		}
	} catch (error) {
		console.error('Xabarni saqlashda xatolik:', error)
		bot.sendMessage(chatId, "Xatolik yuz berdi, qayta urinib ko'ring.")
	}
})

console.log('Bot ishlayapti...')
