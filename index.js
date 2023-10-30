require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const WebSocket = require("ws");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Developing this application" });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected");
    
    const server = app.listen(PORT, () =>
      console.log(`Server has running : ${PORT}`)
    );

    // Create WebSocket server
    const wss = new WebSocket.Server({ server });

    // WebSocket connection handler
    wss.on("connection", (ws) => {
      console.log("WebSocket client connected");

      // WebSocket message received
      ws.on("message", (message) => {
        console.log("Received message:", message);

        // Echo the message back to the client
        ws.send(`Echo: ${message}`);
      });

      // WebSocket connection closed
      ws.on("close", () => {
        console.log("WebSocket client disconnected");
      });
    });
  })
  .catch((err) => console.log(err));
