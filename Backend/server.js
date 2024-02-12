const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/UserRoutes");
const Connect_to_Database = require("./Config/db");
const path = require("path");

const port = process.env.PORT || 5000;
const app = express();
dotenv.config();
app.use(express.json());
Connect_to_Database();

// --------------------------Deploy------------------------------
const __dirnameapdclproject = path.resolve();
if (process.env.NODE_ENV === "productions") {
  app.use(express.static(path.join(__dirnameapdclproject, "../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirnameapdclproject, "build", "index.html"));
  });
} else {
  app.get("/"),
    (req, res) => {
      res.send("Api is running");
    };
}

// --------------------------------------------------------------
app.get("/", (res, req) => {
  res.send("Api is running");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/user", userRoutes);

const server = app.listen(
  5000,
  console.log(`Server is Running at port : ${port}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("A user connected!");

  socket.on("sendNotification", (notification) => {
    // console.log("what is comming" + notification);
    socket.broadcast.emit("newnotification", "hey message came");
  });

  socket.on("newstatus", (status) => {
    // console.log(status);
    socket.broadcast.emit("statuschanged", "make change");
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected!");
  });
});
