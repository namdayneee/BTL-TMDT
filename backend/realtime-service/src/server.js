import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // User join room theo userId để nhận cập nhật đơn hàng
  socket.on("join-user-room", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`Socket ${socket.id} joined user-${userId}`);
  });

  // Admin join room để nhận tất cả notifications
  socket.on("join-admin", () => {
    socket.join("admin-orders");
    console.log(`Admin socket ${socket.id} joined admin-orders`);
  });

  // Join room theo orderId
  socket.on("join-order-room", (orderId) => {
    socket.join(`order-${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Expose io để gateway có thể dùng
global.io = io;

const PORT = process.env.PORT || 3004;

server.listen(PORT, () => {
  console.log(`Realtime Service running on port ${PORT}`);
});
