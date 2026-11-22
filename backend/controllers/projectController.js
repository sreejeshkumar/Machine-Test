
const Project = require("../models/Project");


const createProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      startDate,
      dueDate,
      priority,
      status
    } = req.body;

    
    if (!projectName || !description || !startDate || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    
    if (new Date(dueDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be before start date"
      });
    }

    const project = await Project.create({
      projectName,
      description,
      startDate,
      dueDate,
      priority,
      status,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const getAllProjects = async (req, res) => {
  try {
    
    const {
      search,
      page = 1,
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

  
    const currentPage = Math.max(1, parseInt(page) || 1);
    const limit = 10;
    const skip = (currentPage - 1) * limit;

   
    const filter = {
      createdBy: req.user._id
    };

   
    if (search) {
      filter.projectName = {
        $regex: search,
        $options: "i"
      };
    }

    
    const allowedSortFields = ["createdAt", "dueDate"];

    const selectedSortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const sortOptions = {
      [selectedSortField]: sortOrder
    };

    
    const totalProjects = await Project.countDocuments(filter);

    
    const projects = await Project.find(filter)
      .populate("createdBy", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalProjects,
      currentPage,
      totalPages: Math.ceil(totalProjects / limit),
      limit,
      projects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      project
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const updateProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      startDate,
      dueDate,
      priority,
      status
    } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    
    if (projectName !== undefined) project.projectName = projectName;
    if (description !== undefined) project.description = description;
    if (startDate !== undefined) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;
    if (priority !== undefined) project.priority = priority;
    if (status !== undefined) project.status = status;

   
    if (new Date(project.dueDate) < new Date(project.startDate)) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be before start date"
      });
    }

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
};
