const LocalizationRouter = require("express").Router();
const {
  CreateLocalization,
  GetLocalization,
} = require("../controller/localization.controller");

LocalizationRouter.post("/create", CreateLocalization);
LocalizationRouter.get("/get", GetLocalization);

module.exports = LocalizationRouter;
