const {
  LoginController,
  GetMeController,
} = require("../controller/auth.controller");
const { TEACHING_CENTER_OR_TEACHERS } = require("../middleware");

const validateRequestBody = require("../middleware/check-request-body");

const { authSchema } = require("../validation");

const AuthRouter = require("express").Router();

AuthRouter.post("/login", validateRequestBody(authSchema), LoginController);
AuthRouter.get("/get-me", TEACHING_CENTER_OR_TEACHERS, GetMeController);

module.exports = AuthRouter;
  