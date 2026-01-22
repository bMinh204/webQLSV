const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @route   GET /api/students
// @desc    Lấy danh sách tất cả sinh viên
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ: " + err.message });
  }
});

// @route   POST /api/students
// @desc    Thêm người dùng mới (Admin tạo - có thể là student/teacher/admin)
router.post("/", async (req, res) => {
  try {
    const { studentId, fullName, email, password, role } = req.body;

    // 1. Kiểm tra thông tin bắt buộc
    if (!studentId || !fullName || !email) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ: Mã người dùng, Họ tên và Email" });
    }

    // 2. Kiểm tra trùng lặp
    const existingUser = await Student.findOne({ studentId });
    if (existingUser) {
      return res.status(400).json({ message: "Mã người dùng này đã tồn tại trên hệ thống" });
    }

    // 3. Mã hóa mật khẩu (Mặc định là 123456 nếu không gửi từ Frontend)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || "123456", salt);

    // 4. Tạo đối tượng người dùng mới với role (mặc định là student nếu không có)
    const student = new Student({
      studentId,
      fullName,
      email,
      password: hashedPassword,
      role: role || "student" // Hỗ trợ student, teacher, admin
    });

    const savedStudent = await student.save();
    
    // Trả về dữ liệu nhưng không kèm mật khẩu đã mã hóa (bảo mật)
    const responseData = savedStudent.toObject();
    delete responseData.password;

    console.log("✅ Đã tạo người dùng thành công:", savedStudent.studentId, "- Vai trò:", savedStudent.role);
    res.status(201).json(responseData);

  } catch (err) {
    console.error("❌ Lỗi POST /api/students:", err.message);
    res.status(400).json({ message: "Không thể tạo người dùng: " + err.message });
  }
});

// @route   POST /api/students/login
// @desc    Đăng nhập cho sinh viên
router.post("/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // 1. Tìm sinh viên qua mã định danh
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Tài khoản sinh viên không tồn tại" });
    }

    // 2. Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác" });
    }

    // 3. Tạo JWT Token (Hết hạn sau 24h)
    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET || "bi_mat_quan_ly_sinh_vien",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: student._id,
        studentId: student.studentId,
        fullName: student.fullName,
        role: student.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi đăng nhập: " + err.message });
  }
});

// @route   DELETE /api/students/:id
// @desc    Xóa sinh viên
router.delete("/:id", async (req, res) => {
    try {
      await Student.findByIdAndDelete(req.params.id);
      res.json({ message: "Đã xóa sinh viên thành công" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi xóa: " + err.message });
    }
  });

module.exports = router;