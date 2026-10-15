import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!JWT_SECRET) {
    res.status(500).json({
      message: "Authentication is not configured",
    });
    return;
  }

  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "string"
    ) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

