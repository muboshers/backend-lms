const {
  createTeachingCenterAdminController,
  updateTeachingCenterAdminController,
  deleteTeachingCenterAdminController,
  getTeachingCenterAdminController,
  GetByIdOrMeTeachingCenterController,
  teachingCenterUpdateController,
} = require("../controller/teaching-center.controller");

const { validateRequestBody } = require("../middleware");

const {
  createTeachingCenterAdminSchema,
  updateTeachingCenterSchema,
} = require("../validation");

const TeachingCentersRouter = require("express").Router();

TeachingCentersRouter.post(
  "/create",
  validateRequestBody(createTeachingCenterAdminSchema),
  createTeachingCenterAdminController
);

TeachingCentersRouter.patch("/update/:id", updateTeachingCenterAdminController);

TeachingCentersRouter.delete(
  "/delete/:id",
  deleteTeachingCenterAdminController
);

TeachingCentersRouter.get("/list", getTeachingCenterAdminController);

TeachingCentersRouter.get("/get/:id", GetByIdOrMeTeachingCenterController);

TeachingCentersRouter.get("/get-me", GetByIdOrMeTeachingCenterController);
TeachingCentersRouter.patch(
  "/profile",
  validateRequestBody(updateTeachingCenterSchema),
  teachingCenterUpdateController
);

module.exports = TeachingCentersRouter;
