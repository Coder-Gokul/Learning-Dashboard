const router = require("express").Router();
const Course = require("../models/courseModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");

//create task
router.post("/create-task", authMiddleware, async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.send({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all task
router.post("/get-all-tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find(req.body.filters).populate("assignedTo").populate("assignedBy").populate("course");
    res.send({
      success: true,
      message: "Task fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//update task
router.post("/update-task", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.body._id,req.body);
    res.send({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//delete task
router.post("/delete-task", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//create multer storage for Task
const taskStorage = multer.diskStorage({
  filename: function(req,file,cb){
    cb(null,Date.now()+ file.originalname);
  },
});
router.post("/upload-task-image",authMiddleware, multer({storage:taskStorage}).single("file"),async(req,res)=>{
  try {
    const result = await cloudinary.uploader.upload(req.file.path,{folder:"tasks",
  });
  const imageURL =result.secure_url;
  await Task.findOneAndUpdate(
    {_id:req.body.taskId},
    {$push:{
      attachments: imageURL,
    },
  }
  );
  res.send({
    success:true,
    message:"Image uploaded successfully",
  });
  } catch (error) {
    res.send({
      success:false,
      message:error.message,
    });
  }
});



module.exports = router;
