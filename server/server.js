require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// 1. Kết nối cơ sở dữ liệu
connectDB();

// 2. Cấu hình Middleware
app.use(cors());
app.use(express.json()); // Đảm bảo đọc được dữ liệu JSON từ yêu cầu POST

// 3. Các đường dẫn API
app.use("/api/students", require("./routes/studentRoutes"));

app.get("/", (req, res) => {
  res.send("Backend Server đang chạy!");
});

// 4. Khởi động Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});