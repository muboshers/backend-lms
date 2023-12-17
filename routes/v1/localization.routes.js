const LocalizationRouter = require("express").Router();
const {
  CreateLocalization,
  GetLocalization,
  GetTeachingCenterLanguages,
} = require("../../controller/v1/localization.controller");

LocalizationRouter.post("/create", CreateLocalization);
LocalizationRouter.get("/get", GetLocalization);
LocalizationRouter.get("/get-locale", GetTeachingCenterLanguages);

module.exports = LocalizationRouter;
