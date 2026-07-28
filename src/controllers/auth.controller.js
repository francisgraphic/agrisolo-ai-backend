const authService = require("../services/auth.service");

console.log("✅ auth.controller.js loaded");

/**
 * Register User
 */
async function register(req, res) {
  try {
    console.log("➡️ Register endpoint hit");

    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Login User
 */
async function login(req, res) {
  try {
    console.log("➡️ Login endpoint hit");

    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Get Logged-in User Profile
 */
async function profile(req, res) {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  register,
  login,
  profile,
};