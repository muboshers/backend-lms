const {
  CreateGroupController,
  UpdateGroupController,
  DeleteGroupController,
  GetGroupListController,
  GetGroupByIdController,
} = require("../controller/group.controller");

const validateRequestBody = require("../middleware/check-request-body");
const { groupSchema } = require("../validation");

const GroupRouter = require("express").Router();

GroupRouter.post(
  "/create",
  validateRequestBody(groupSchema),
  CreateGroupController
);

GroupRouter.patch(
  "/update/:id",
  validateRequestBody(groupSchema),
  UpdateGroupController
);

GroupRouter.get("/list", GetGroupListController);
GroupRouter.get("/get/:id", GetGroupByIdController);

GroupRouter.delete("/delete/:id", DeleteGroupController);

module.exports = GroupRouter;
