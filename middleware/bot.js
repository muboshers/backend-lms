const TelegramBot = require("node-telegram-bot-api");

const newBot = (token) => new TelegramBot(token);


module.exports = newBot;