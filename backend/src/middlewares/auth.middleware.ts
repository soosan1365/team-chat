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

// فقط کاربران احراز هویت‌شده اجازه دسترسی دارند
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

    if (typeof payload === "string" || typeof payload.userId !== "string") {
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

// احراز هویت اختیاری؛ مهمان هم می‌تواند لیست روم‌ها را ببیند
export function optionalAuthenticateToken(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.accessToken;

  // بدون کوکی، درخواست به‌عنوان مهمان ادامه پیدا می‌کند
  if (!token || !JWT_SECRET) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload !== "string" && typeof payload.userId === "string") {
      req.userId = payload.userId;
    }
  } catch {
    // توکن نامعتبر یا منقضی است؛ برای مسیر عمومی ادامه می‌دهیم
  }

  next();
}
