const {
  CreatePupilsController,
  UpdatePupilsController,
  GetPupilsListPupilsController,
  DeletePupilsController,
} = require("../controller/pupils.controller");

const PupilsRouter = require("express").Router();

PupilsRouter.post("/create", CreatePupilsController);
PupilsRouter.patch("/update/:id", UpdatePupilsController);
PupilsRouter.delete("/delete/:id", DeletePupilsController);
PupilsRouter.get("/get-list", GetPupilsListPupilsController);

module.exports = PupilsRouter;
