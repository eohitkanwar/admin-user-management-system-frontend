const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("New client connected");

  ws.on("message", (message) => {
    const text = message.toString();
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(text);
        console.log("client says", text);
      }
      ws.on("close", () => {
        clients = clients.filter((client) => client !== ws);
        console.log("client diconnected")
      });
    });
  });
});

app.use(express.static("public"));

server.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});

// const WebSocket = require("ws");
// const wss = new WebSocket.Server({ port: 3000 });

// wss.on("connection", (ws) => {
//   console.log("New client connected");
//   ws.send("hello client");

//   ws.on("message", (msg) => {
//     console.log("client says", msg.toString());
//   });

//   ws.on("close", () => {
//     console.log("client disconnected");
//   });
// });
