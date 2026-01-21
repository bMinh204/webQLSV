const User = require("../models/User");
const Course = require("../models/Course");
const Grade = require("../models/Grade");

exports.hello = (req, res) => {
  res.json({ message: "Hello from backend " });
};

// ============ AUTH CONTROLLERS ============

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============ USER CONTROLLERS ============

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    // Set default password if not provided
    const userData = {
      ...req.body,
      password: req.body.password || '123456'
    };
    const user = new User(userData);
    const savedUser = await user.save();
    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ COURSE CONTROLLERS ============

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("teacher", "fullName email")
      .populate("students", "fullName email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "fullName email")
      .populate("students", "fullName email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("teacher", "fullName email")
     .populate("students", "fullName email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ GRADE CONTROLLERS ============

// Get all grades
exports.getGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate("student", "fullName email")
      .populate("course", "name code");
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get grades by student ID
exports.getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate("course", "name code credits");
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get grades by course ID
exports.getGradesByCourse = async (req, res) => {
  try {
    const grades = await Grade.find({ course: req.params.courseId })
      .populate("student", "fullName email");
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new grade
exports.createGrade = async (req, res) => {
  try {
    const grade = new Grade(req.body);
    const savedGrade = await grade.save();
    res.status(201).json(savedGrade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update grade
exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("student", "fullName email")
     .populate("course", "name code");
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.json(grade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete grade
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.json({ message: "Grade deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};