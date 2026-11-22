
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");


const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      dueDate,
      priority,
      status
    } = req.body;

 
    if (!title || !description || !project || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

   
    const existingProject = await Project.findOne({
      _id: project,
      createdBy: req.user._id
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

   
    const existingUser = await User.findById(assignedTo);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found"
      });
    }

   
    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
      priority,
      status,
      createdBy: req.user._id
    });

    const createdTask = await Task.findById(task._id)
      .populate("project", "projectName")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: createdTask
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




const getAllTasks = async (req, res) => {
  try {
    // Get query parameters
    const {
      search,
      status,
      priority,
      assignedTo,
      page = 1,
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    // Pagination
    const currentPage = Math.max(1, parseInt(page) || 1);
    const limit = 10;
    const skip = (currentPage - 1) * limit;

    // Only show tasks created by or assigned to logged-in user
    const filter = {
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    };

    // Search tasks by title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i"
      };
    }

    // Filter by task status
    if (status) {
      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // Filter by assigned user
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Sorting
    const allowedSortFields = ["createdAt", "dueDate"];

    const selectedSortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const sortOptions = {
      [selectedSortField]: sortOrder
    };

    // Count matching tasks
    const totalTasks = await Task.countDocuments(filter);

    // Fetch paginated tasks
    const tasks = await Task.find(filter)
      .populate("project", "projectName")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalTasks,
      currentPage,
      totalPages: Math.ceil(totalTasks / limit),
      limit,
      tasks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    })
      .populate("project", "projectName description")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();

 
    const {
      title,
      description,
      project,
      assignedTo,
      dueDate,
      priority,
      status
    } = req.body;

   
    if (project !== undefined) {
      const existingProject = await Project.findOne({
        _id: project,
        
      });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }

      task.project = project;
    }

   
    if (assignedTo !== undefined) {
      const existingUser = await User.findById(assignedTo);

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found"
        });
      }

      task.assignedTo = assignedTo;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();

    const result = await Task.findById(updatedTask._id)
      .populate("project", "projectName")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
     
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you are not allowed to delete it"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};
