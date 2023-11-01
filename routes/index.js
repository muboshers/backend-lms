const AuthRouter = require("./auth.routes");
const FilesRouter = require("./files.routes");
const TeacherRouter = require("./teacher.routes");
const TeachingCentersRouter = require("./teaching-centers.routes");
const GroupRouter = require("./group.routes");

module.exports = {
  FilesRouter,
  AuthRouter,
  TeacherRouter,
  TeachingCentersRouter,
  GroupRouter,
};
