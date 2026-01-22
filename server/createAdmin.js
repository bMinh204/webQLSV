require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("./models/Student");

const createAdmin = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/qlsv");
    console.log("✅ Đã kết nối MongoDB");

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await Student.findOne({ studentId: "ADMIN001" });
    if (existingAdmin) {
      console.log("⚠️ Tài khoản admin đã tồn tại!");
      console.log("Tài khoản: ADMIN001");
      console.log("Mật khẩu: admin123");
      process.exit(0);
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Tạo tài khoản admin
    const admin = new Student({
      studentId: "ADMIN001",
      fullName: "Quản trị viên hệ thống",
      email: "admin@university.edu.vn",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    console.log("✅ Đã tạo tài khoản admin thành công!");
    console.log("================================");
    console.log("Tài khoản: ADMIN001");
    console.log("Mật khẩu: admin123");
    console.log("Email: admin@university.edu.vn");
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
};

createAdmin();
