import http from "http";

import app from "./app.js";

import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  socket.on("join-order-room", (orderId) => {
    socket.join(`order-${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

server.listen(PORT, () => {
  console.log(
    `Gateway running on port ${PORT}`
  );
});