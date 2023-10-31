const { LoginController } = require("../controller/auth.controller");

const validateRequestBody = require("../middleware/check-request-body");

const { authSchema } = require("../validation");

const AuthRouter = require("express").Router();

AuthRouter.post("/login", validateRequestBody(authSchema), LoginController);

module.exports = AuthRouter;
