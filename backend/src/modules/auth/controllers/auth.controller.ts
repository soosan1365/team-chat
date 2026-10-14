
import type { Request, Response } from "express";
import { registerUser } from "../services/auth.service.js";

export async function registerController(
  req: Request,
  res: Response,
) {
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
        message: "Name, valid email, and password of at least 8 characters are required",
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
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    console.error("Registration failed:", error);
    res.status(500).json({ message: "Registration failed" });
  }
}
