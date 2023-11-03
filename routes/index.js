const AuthRouter = require("./auth.routes");
const FilesRouter = require("./files.routes");
const TeacherRouter = require("./teacher.routes");
const GroupRouter = require("./group.routes");
const TopicRouter = require("./topic.routes");
const PupilsRouter = require("./pupils.routes");
const TeachingCentersRouter = require("./teaching-centers.routes");

module.exports = {
  FilesRouter,
  AuthRouter,
  TeacherRouter,
  TeachingCentersRouter,
  GroupRouter,
  TopicRouter,
  PupilsRouter, 
};
