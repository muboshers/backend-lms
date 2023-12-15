const {
  CreatePupilsController,
  UpdatePupilsController,
  GetPupilsListPupilsController,
  DeletePupilsController, GetPupilsByTopicId,
} = require("../controller/pupils.controller");

const PupilsRouter = require("express").Router();

PupilsRouter.post("/create", CreatePupilsController);
PupilsRouter.patch("/update/:id", UpdatePupilsController);
PupilsRouter.delete("/delete/:id", DeletePupilsController);
PupilsRouter.get("/get-list", GetPupilsListPupilsController);
PupilsRouter.get("/get-by-topic/:topicId", GetPupilsByTopicId);

module.exports = PupilsRouter;
