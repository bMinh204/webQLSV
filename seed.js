require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./config/src/models/User");
const Course = require("./config/src/models/Course");
const Grade = require("./config/src/models/Grade");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Course.deleteMany({});
    await Grade.deleteMany({});
    console.log("Đã xóa dữ liệu cũ");

    // Tạo users
    const admin = await User.create({
      username: "admin",
      email: "admin@educhain.com",
      password: "admin123",
      role: "admin",
      fullName: "Quản trị viên"
    });

    const teacher1 = await User.create({
      username: "giaovien1",
      email: "teacher1@educhain.com",
      password: "teacher123",
      role: "teacher",
      fullName: "Nguyễn Văn A"
    });

    const teacher2 = await User.create({
      username: "giaovien2",
      email: "teacher2@educhain.com",
      password: "teacher123",
      role: "teacher",
      fullName: "Trần Thị B"
    });

    const student1 = await User.create({
      username: "sinhvien1",
      email: "student1@educhain.com",
      password: "student123",
      role: "student",
      fullName: "Lê Văn C"
    });

    const student2 = await User.create({
      username: "sinhvien2",
      email: "student2@educhain.com",
      password: "student123",
      role: "student",
      fullName: "Phạm Thị D"
    });

    const student3 = await User.create({
      username: "sinhvien3",
      email: "student3@educhain.com",
      password: "student123",
      role: "student",
      fullName: "Hoàng Văn E"
    });

    console.log("Đã tạo users");

    // Tạo courses
    const course1 = await Course.create({
      name: "Lập trình Web",
      code: "IT101",
      description: "Học về HTML, CSS, JavaScript và React",
      teacher: teacher1._id,
      students: [student1._id, student2._id, student3._id],
      credits: 3
    });

    const course2 = await Course.create({
      name: "Cơ sở dữ liệu",
      code: "IT102",
      description: "Học về MongoDB, MySQL và thiết kế database",
      teacher: teacher1._id,
      students: [student1._id, student2._id],
      credits: 4
    });

    const course3 = await Course.create({
      name: "Toán cao cấp",
      code: "MATH201",
      description: "Giải tích và đại số tuyến tính",
      teacher: teacher2._id,
      students: [student1._id, student3._id],
      credits: 3
    });

    console.log("Đã tạo courses");

    // Tạo grades
    await Grade.create([
      {
        student: student1._id,
        course: course1._id,
        score: 8.5,
        semester: "2025-2026-1"
      },
      {
        student: student1._id,
        course: course2._id,
        score: 9.0,
        semester: "2025-2026-1"
      },
      {
        student: student1._id,
        course: course3._id,
        score: 7.5,
        semester: "2025-2026-1"
      },
      {
        student: student2._id,
        course: course1._id,
        score: 7.0,
        semester: "2025-2026-1"
      },
      {
        student: student2._id,
        course: course2._id,
        score: 8.0,
        semester: "2025-2026-1"
      },
      {
        student: student3._id,
        course: course1._id,
        score: 9.5,
        semester: "2025-2026-1"
      },
      {
        student: student3._id,
        course: course3._id,
        score: 8.0,
        semester: "2025-2026-1"
      }
    ]);

    console.log("Đã tạo grades");
    console.log("\n=== Dữ liệu mẫu đã được tạo thành công! ===");
    console.log(`- ${await User.countDocuments()} users`);
    console.log(`- ${await Course.countDocuments()} courses`);
    console.log(`- ${await Grade.countDocuments()} grades`);
    console.log("\nMở MongoDB Compass và kết nối với: mongodb://127.0.0.1:27017/mydb");
    
    process.exit(0);
  } catch (error) {
    console.error("Lỗi khi tạo dữ liệu:", error);
    process.exit(1);
  }
};

// Chạy script
connectDB().then(() => {
  seedData();
});
