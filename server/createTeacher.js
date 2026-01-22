require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("./models/Student");

const createTeacher = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/qlsv");
    console.log("✅ Đã kết nối MongoDB");

    // Kiểm tra xem giáo viên đã tồn tại chưa
    const existingTeacher = await Student.findOne({ studentId: "GV001" });
    if (existingTeacher) {
      console.log("⚠️ Tài khoản giáo viên đã tồn tại!");
      console.log("Tài khoản: GV001");
      console.log("Mật khẩu: 123456");
      process.exit(0);
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // Tạo tài khoản giáo viên
    const teacher = new Student({
      studentId: "GV001",
      fullName: "Nguyễn Văn Giảng",
      email: "gv001@university.edu.vn",
      password: hashedPassword,
      role: "teacher"
    });

    await teacher.save();

    console.log("✅ Đã tạo tài khoản giáo viên thành công!");
    console.log("================================");
    console.log("Tài khoản: GV001");
    console.log("Mật khẩu: 123456");
    console.log("Email: gv001@university.edu.vn");
    console.log("Vai trò: Giảng viên");
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
};

createTeacher();
