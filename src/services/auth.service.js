const jwt = require("../utils/jwt");
const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

// =========================
// Register User
// =========================
async function registerUser(data) {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      country: data.country,
      state: data.state,
    },
  });

  // Generate JWT
  const token = jwt.generateToken(user);

  // Remove password before sending response
  const safeUser = { ...user };
  delete safeUser.password;

  return {
    user: safeUser,
    token,
  };
}

// =========================
// Login User
// =========================
async function loginUser(email, password) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = jwt.generateToken(user);

  // Remove password before sending response
  const safeUser = { ...user };
  delete safeUser.password;

  return {
    user: safeUser,
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};