const TelegramBot = require("node-telegram-bot-api");
const botModel = require("../../model/v1/bot.model");
const {default: axios} = require("axios");
const tgUserModel = require("../../model/v1/tg_user.model");

const getBot = (token) => new TelegramBot(token);

const CreateUserFromTelegram = async (req, res) => {
    try {
        // #swagger.tags = ['Telegram Bot']
        // #swagger.summary = "Create telegram user"
        // #swagger.ignore = true
        const {
            id: chat_id,
            first_name,
            last_name = "",
            username = "",
        } = req.body.message.chat;

        const {bot_token} = req.params;

        const currentBot = await botModel.findOne({
            token: bot_token,
        });

        const greeting_message = currentBot?.greeting_message?.replace(
            "{{tg_user_name}}",
            `${first_name} ${last_name}`
        );

        const currentUser = await tgUserModel.findOne({
            bot_id: currentBot._id,
            chat_id,
        });

        const opts = {
            reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: true,
                keyboard: [
                    [
                        {text: "Xodimlar bilan bo'glanish"},
                        {text: "Kurslar xaqida ma'lumot olish"},
                    ],
                    [{text: "Eng ko'p so'raladigan savollar"}],
                ],
            },
        };

        if (!currentUser) {
            await tgUserModel.create({
                chat_id,
                first_name,
                last_name,
                username,
                bot_id: currentBot?._id,
            });
        }

        const bot = getBot(bot_token);

        bot.sendMessage(chat_id, greeting_message, opts);

        res.status(200).json({message: "Success"});
    } catch (error) {
        console.log(error);

        // Respond with an error if there's an issue with the bot initialization
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    CreateUserFromTelegram,
};
