const AuthRouter = require("./auth.routes");
const FilesRouter = require("./files.routes");
const TeacherRouter = require("./teacher.routes");
const GroupRouter = require("./group.routes");
const TopicRouter = require("./topic.routes");
const PupilsRouter = require("./pupils.routes");
const TeachingCentersRouter = require("./teaching-centers.routes");
const LocalizationRouter = require("./localization.routes");
const TgBotRoutes = require("./tg-bot.routes");
module.exports = {
    FilesRouter,
    LocalizationRouter,
    AuthRouter,
    TeacherRouter,
    TeachingCentersRouter,
    GroupRouter,
    TopicRouter,
    PupilsRouter,
    TgBotRoutes,
};


