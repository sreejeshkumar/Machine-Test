const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  try {
    
    const projectFilter = {
      createdBy: req.user._id
    };

    
    const taskFilter = {
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    };

   
    const [
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      recentProjects,
      recentTasks
    ] = await Promise.all([
      Project.countDocuments(projectFilter),

      Task.countDocuments(taskFilter),

      Task.countDocuments({
        ...taskFilter,
        status: "Completed"
      }),

      Task.countDocuments({
        ...taskFilter,
        status: { $in: ["Todo", "Review"] }
      }),

      Task.countDocuments({
        ...taskFilter,
        status: "In Progress"
      }),

      Project.find(projectFilter)
        .sort({ createdAt: -1 })
        .limit(5),

      Task.find(taskFilter)
        .populate("project", "projectName")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks
      },
      recentProjects,
      recentTasks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getDashboardStats };