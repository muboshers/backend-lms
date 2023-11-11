const {
  CreateGroupController,
  UpdateGroupController,
  DeleteGroupController,
  GetGroupListController,
  GetGroupByIdController,
} = require("../controller/group.controller");

const validateRequestBody = require("../middleware/check-request-body");
const { groupCreateSchema } = require("../validation");

const GroupRouter = require("express").Router();

GroupRouter.post(
  "/create",
  validateRequestBody(groupCreateSchema),
  CreateGroupController
);

GroupRouter.patch(
  "/update/:id",
  validateRequestBody(groupCreateSchema),
  UpdateGroupController
);

GroupRouter.get("/list", GetGroupListController);
GroupRouter.get("/get/:id", GetGroupByIdController);

GroupRouter.delete("/delete/:id", DeleteGroupController);

module.exports = GroupRouter;
