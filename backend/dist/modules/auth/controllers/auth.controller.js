import { registerUser } from "../services/auth.service.js";
import { loginUser } from "../services/auth.service.js";
import { prisma } from "../../../lib/prisma.js";
export async function registerController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      res.status(400).json({
        message:
          "Name, valid email, and password of at least 8 characters are required",
      });
      return;
    }
    const user = await registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      res.status(409).json({ message: "Email already exists" });
      return;
    }
    console.error("Registration failed:", error);
    res.status(500).json({ message: "Registration failed" });
  }
}
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }
    const result = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });
    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.json({
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed" });
  }
}
export async function meController(req, res) {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    res.json({ user });
  } catch (error) {
    console.error("Failed to get current user:", error);
    res.status(500).json({ message: "Could not get current user" });
  }
}
export function logoutController(_req, res) {
  res.clearCookie("accessToken", {
    httpOnly: true,
  secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
}
//# sourceMappingURL=auth.controller.js.map
