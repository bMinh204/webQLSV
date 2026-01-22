const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Thêm trường password để sinh viên đăng nhập
  password: { 
    type: String, 
    required: true 
  },
  // Thêm vai trò để phân quyền (mặc định là student)
  role: { 
    type: String, 
    default: "student" 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Student", studentSchema);