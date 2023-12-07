const TgBotRoutes = require("express").Router();

const { CreateUserFromTelegram } = require("../controller/tg-user.controller");

TgBotRoutes.post("/:bot_token", CreateUserFromTelegram);

module.exports = TgBotRoutes;
