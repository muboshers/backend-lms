require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { WebSocketServer } = require("ws");

const {
  TeachingCentersRouter,
  FilesRouter,
  AuthRouter,
  TeacherRouter,
  GroupRouter,
  TopicRouter,
  PupilsRouter,
  LocalizationRouter,
  TgBotRoutes,
} = require("./routes");

const { TEACHING_CENTER_OR_TEACHERS } = require("./middleware");

const TelegramBot = require("node-telegram-bot-api");

const app = express();

app.use(express.json());
app.use(express.static("./public"));
app.use(
  cors({
    origin: [
      "http://127.0.0.1:3030",
      "http://localhost:3030",
      "https://app-lms-dashboard.vercel.app",
    ],
    methods: ["*"],
  })
);

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  // const bot_token = "6795907871:AAHjoaUJlbuys_zdO_Rb4h8DPo2_h7R2maU";

  // const bot = new TelegramBot(bot_token);

  // bot.setWebHook(
  //   `https://1a05-213-230-69-2.ngrok-free.app/v1/api/telegram/${bot_token}`
  // );

  res.json({ message: "Developing this app" });
});

const isTestAuth = (req, res, next) => {
  req.teachingCenterId = "653f4a4cc1a6a6e2d" + "5a14672";
  next();
};

app.use("/v1/api/telegram", TgBotRoutes);
app.use("/v1/api/teaching-center", isTestAuth, TeachingCentersRouter);
app.use("/v1/api/file", TEACHING_CENTER_OR_TEACHERS, FilesRouter);
app.use("/v1/api/auth", AuthRouter);
app.use("/v1/api/teacher", TEACHING_CENTER_OR_TEACHERS, TeacherRouter);
app.use("/v1/api/group", TEACHING_CENTER_OR_TEACHERS, GroupRouter);
app.use("/v1/api/topic", TEACHING_CENTER_OR_TEACHERS, TopicRouter);
app.use("/v1/api/pupils", TEACHING_CENTER_OR_TEACHERS, PupilsRouter);
app.use(
  "/v1/api/localization",
  TEACHING_CENTER_OR_TEACHERS,
  LocalizationRouter
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected");

    const sockserver = new WebSocketServer({
      server: app.listen(PORT),
    });

    console.log(`Server is running : ${PORT}`);

    sockserver.on("connection", (ws) => {
      console.log("New client connected!");
      ws.send("connection established");
      ws.on("close", () => console.log("Client has disconnected!"));
      ws.on("message", (data) => {
        sockserver.clients.forEach((client) => {
          console.log(`distributing message: ${data}`);
          client.send(`${data}`);
        });
      });
      ws.onerror = function () {
        console.log("websocket error");
      };
    });
  })
  .catch((err) => console.log(err));
