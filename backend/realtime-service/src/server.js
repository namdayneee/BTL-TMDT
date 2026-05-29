import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
  console.log(`Realtime Service running on port ${PORT}`);
});