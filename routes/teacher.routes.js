const TeacherRouter = require("express").Router();

const {
  CreateTeacherController,
  TeacherUpdateController,
} = require("../controller/teacher.controller");

TeacherRouter.post("/create", CreateTeacherController);
TeacherRouter.patch("/update/:id", TeacherUpdateController);

module.exports = TeacherRouter;
