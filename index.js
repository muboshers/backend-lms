require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const {WebSocketServer} = require("ws");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Middleware
const {TEACHING_CENTER_OR_TEACHERS} = require("./middleware");

// Routes
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
} = require("./routes/v1");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("./public"));
app.use(cors({
    origin: [
        "http://127.0.0.1:3030",
        "http://localhost:3030",
        "https://app-lms-dashboard.vercel.app",
    ],
    methods: ["*"],
}));

// Define API routes
app.use("/v1/api/telegram", TgBotRoutes);
app.use("/v1/api/teaching-center", TEACHING_CENTER_OR_TEACHERS, TeachingCentersRouter);
app.use("/v1/api/file", TEACHING_CENTER_OR_TEACHERS, FilesRouter);
app.use("/v1/api/auth", AuthRouter);
app.use("/v1/api/teacher", TEACHING_CENTER_OR_TEACHERS, TeacherRouter);
app.use("/v1/api/group", TEACHING_CENTER_OR_TEACHERS, GroupRouter);
app.use("/v1/api/topic", TEACHING_CENTER_OR_TEACHERS, TopicRouter);
app.use("/v1/api/pupils", TEACHING_CENTER_OR_TEACHERS, PupilsRouter);
app.use("/v1/api/localization", TEACHING_CENTER_OR_TEACHERS, LocalizationRouter);

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
}));

// Handle root route
app.get("/", (req, res) => {
    res.json({message: "Developing this app"});
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        startServer();
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });

    const sockserver = new WebSocketServer({server});

    sockserver.on("connection", (ws) => {
        console.log("New client connected!");
        ws.send("Connection established");

        ws.on("close", () => {
            console.log("Client has disconnected!");
        });

        ws.on("message", (data) => {
            sockserver.clients.forEach((client) => {
                console.log(`Distributing message: ${data}`);
                client.send(`${data}`);
            });
        });

        ws.onerror = function () {
            console.log("WebSocket error");
        };
    });
}
