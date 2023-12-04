require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { WebSocketServer } = require("ws");

const sockserver = new WebSocketServer({ port: 443 });

const {
  TeachingCentersRouter,
  FilesRouter,
  AuthRouter,
  TeacherRouter,
  GroupRouter,
  TopicRouter,
  PupilsRouter,
} = require("./routes");

const { TEACHING_CENTER_OR_TEACHERS } = require("./middleware");

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

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Developing this app" });
});

const isTestAuth = (req, res, next) => {
  req.teachingCenterId = "653f4a4cc1a6a6e2d" + "5a14672";
  next();
};

app.use("/v1/api/teaching-center", isTestAuth, TeachingCentersRouter);
app.use("/v1/api/file", TEACHING_CENTER_OR_TEACHERS, FilesRouter);
app.use("/v1/api/auth", AuthRouter);
app.use("/v1/api/teacher", TEACHING_CENTER_OR_TEACHERS, TeacherRouter);
app.use("/v1/api/group", TEACHING_CENTER_OR_TEACHERS, GroupRouter);
app.use("/v1/api/topic", TEACHING_CENTER_OR_TEACHERS, TopicRouter);
app.use("/v1/api/pupils", TEACHING_CENTER_OR_TEACHERS, PupilsRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => console.log(`Server has running : ${PORT}`));
  })
  .catch((err) => console.log(err));
