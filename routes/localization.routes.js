const LocalizationRouter = require("express").Router();
const {
  CreateLocalization,
  GetLocalization,
  GetTeachingCenterLanguages,
} = require("../controller/localization.controller");

LocalizationRouter.post("/create", CreateLocalization);
LocalizationRouter.get("/get", GetLocalization);
LocalizationRouter.get("/get-locale", GetTeachingCenterLanguages);

module.exports = LocalizationRouter;
