require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/qlsv");
    console.log("✅ Đã kết nối MongoDB");

    const user = await Student.findOne({ studentId: "GV001" });
    
    if (user) {
      console.log("Thông tin tài khoản GV001:");
      console.log("- Tên:", user.fullName);
      console.log("- Email:", user.email);
      console.log("- Role:", user.role);
      console.log("- Role type:", typeof user.role);
    } else {
      console.log("❌ Không tìm thấy tài khoản GV001");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
};

checkUser();
