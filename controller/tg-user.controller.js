const TelegramBot = require("node-telegram-bot-api");

const getBoot = (token) => new TelegramBot(token);

const CreateUserFromTelegram = async (req, res) => {
  try {
    const { bot_token } = req.params;

    const bot = getBoot(bot_token);
    console.log(req.body);
    bot.sendMessage(req.body.message.chat.id, "Hello guys");

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);

    // Respond with an error if there's an issue with the bot initialization
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CreateUserFromTelegram,
};
