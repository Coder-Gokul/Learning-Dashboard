const router = require("express").Router();
const Course = require("../models/courseModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");


//creating a course
router.post("/create-course", authMiddleware, async (req, res) => {
  try {
    const newCourse = new Course(req.body);

    await newCourse.save();
    res.send({
      success: true,
      data: newCourse,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//get all courses
router.post("/get-all-courses", authMiddleware, async (req, res) => {
  try {
   
    const courses = await Course.find({
      owner:req.body.userId
    }
      || {}).sort({ createdAt: -1 }); // sorting the course list based on the created date & time
    res.send({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//get Course by id
router.post("/get-course-by-id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.body._id)
      .populate("owner")
      .populate("members.user");
    res.send({
      success: true,
      data: course,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//get Courses by role
router.post("/get-courses-by-role", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const courses = await Course.find({ "members.user": userId })
      .sort({
        createdAt: -1,
      })
      .populate("owner");
    res.send({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//Edit a course
router.post("/edit-course", authMiddleware, async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//Delete a course
router.post("/delete-course", authMiddleware, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

//Add a educator to a course
router.post("/add-educator", authMiddleware, async (req, res) => {
  try {
    const { email, role, courseId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        success: false,
        message: "Educator not found",
      });
    }
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        members: {
          user: user._id,
          role,
        },
      },
    });
    res.send({
      success: true,
      message: "Educator added successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// Add a Student to a course

router.post("/add-student", authMiddleware, async (req, res) => {
  try {
    const { email, role, courseId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        success: false,
        message: "Student not found",
      });
    }
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        members: {
          user: user._id,
          role,
        },
      },
    });
    res.send({
      success: true,
      message: "Student added successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// Remove a Student from a course

router.post("/remove-student", authMiddleware, async (req, res) => {
  try {
    const { memberId, courseId } = req.body;

    const course = await Course.findById(courseId);
    course.members.pull(memberId);
    await course.save();
    res.send({
      success: true,
      message: "Student removed successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// Remove a Educator from a course

router.post("/remove-educator", authMiddleware, async (req, res) => {
  try {
    const { memberId, courseId } = req.body;

    const course = await Course.findById(courseId);
    course.members.pull(memberId);
    await course.save();
    res.send({
      success: true,
      message: "Student removed successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

module.exports = router;
