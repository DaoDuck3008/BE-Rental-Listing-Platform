import http from "http";
import app from "./app.js";
import { initSocket } from "./sockets/index.js";

const PORT = process.env.PORT || 5000;

// Tạo HTTP server từ Express app để Socket.io có thể chạy song song
const server = http.createServer(app);

// Khởi tạo Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`>>> Server is running on port ${PORT}`);
});
