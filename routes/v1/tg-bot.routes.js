const TgBotRoutes = require("express").Router();

const {CreateUserFromTelegram} = require("../../controller/v1/tg-user.controller");

TgBotRoutes.post("/:bot_token", CreateUserFromTelegram);

module.exports = TgBotRoutes;
