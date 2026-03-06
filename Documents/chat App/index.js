const  io = require('socket.io')
const express = require("express");
const { request } = require("http");
const app = express();
const http = require("http");
require("dotenv").config();
const port = 3000;

const server = http.createServer(app);

// const { Server } = require('socket.io')
// const io = new Server(server)

app.set("views", __dirname, +"/views");
app.set("view engine", "jade");
app.engine("jade", require("jade").__express);

app.get("/", function (req, res) {
  res.render("page");
});
app.use(express.static(__dirname + "/public"));

const  midPort = app.listen(port, function () {
  console.log("Node.js listening on port " + port);
});

io.Socket.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("send", (data) => {
    console.log("message", data);
    io.emit("message", data);
  });

  socket.on("diconnected", () => {
    console.log("user diconnected");
  });
});
