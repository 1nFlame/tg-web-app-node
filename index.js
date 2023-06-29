const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const cors = require('cors')
const token = '6057276201:AAELKPFM8M3hIWX92dfGcXLwaBVNCELSo94'
const bot = new TelegramBot(token, {polling: true});
const webAppUrl = 'https://grand-syrniki-9acfba.netlify.app';
const app = express();

app.use(express.json());
app.use(cors());



bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;


    if(text === '/start') {
        await bot.sendMessage(chatId, 'Привет! Это тестовый телеграм-бот интернет магазина.')
        await bot.sendMessage(chatId, 'Для оформления заказа заполни форму ниже.', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        })


        setTimeout(async () => {
            await bot.sendMessage(chatId, 'Ознакомиться с ассортиментом можно по кнопке:', {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Store', web_app: {url: webAppUrl}}]
                    ]
                }
            })
        }, 5000)
    }
    if (msg?.web_app_data?.data) {
        try   {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
           await bot.sendMessage(chatId, 'Спасибо за обратную связь! ')
           await bot.sendMessage(chatId, 'Вы указали адрес: Город ' + data.city + ', улица ' + data.street)

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию Вы можете получить в этом чате.')
            }, 3000)
        } catch (e) {
            console.log(e)
        }
    }
})
app.post('/web-data', async (req, res)  => {
    const {queryId, products, totalPrice} = req.body;
try {
    await bot.answerWebAppQuery(queryId, {
        type: 'article',
        id: queryId,
        title: 'Успешная покупка',
        input_message_content: {message_text: 'Поздравляем с покупкой, Вы приобрели товар на сумму ' + totalPrice}

    })
    return res.status(200).json({})
} catch (e) {
    await bot.answerWebAppQuery(queryId, {
        type: 'article',
        id: queryId,
        title: 'Не удалось приобрести товар',
        input_message_content: {message_text: 'Не удалось приобрести товар'}

    })
    
}
return res.status(500).json({})
})
const PORT = 3000;
app.listen(PORT, () => console.log(`Server starting on PORT: ${PORT}`))


