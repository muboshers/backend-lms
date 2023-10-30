require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

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
    app.listen(PORT, () => console.log(`Server has running : ${PORT}`));
  })
  .catch((err) => console.log(err));
