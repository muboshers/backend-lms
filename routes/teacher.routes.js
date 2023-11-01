const TeacherRouter = require("express").Router();

const {
  CreateTeacherController,
  TeacherUpdateController,
  TeacherDeleteController,
  GetTeachersListController,
} = require("../controller/teacher.controller");

TeacherRouter.post("/create", CreateTeacherController);
TeacherRouter.patch("/update/:id", TeacherUpdateController);
TeacherRouter.delete("/delete/:id", TeacherDeleteController);
TeacherRouter.get("/list", GetTeachersListController);

module.exports = TeacherRouter;
