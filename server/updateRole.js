require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");

const updateUserRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/qlsv");
    console.log("✅ Đã kết nối MongoDB");

    const result = await Student.updateOne(
      { studentId: "GV001" },
      { $set: { role: "teacher" } }
    );

    if (result.modifiedCount > 0) {
      console.log("✅ Đã cập nhật role thành công!");
      
      const user = await Student.findOne({ studentId: "GV001" });
      console.log("================================");
      console.log("Tài khoản: GV001");
      console.log("Tên:", user.fullName);
      console.log("Email:", user.email);
      console.log("Role mới:", user.role);
      console.log("================================");
    } else {
      console.log("❌ Không tìm thấy tài khoản GV001 hoặc role đã đúng");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
};

updateUserRole();
