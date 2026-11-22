
const User = require("../models/User");
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("_id name email")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getUsers };
