import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma.js";
import jwt from "jsonwebtoken";
export async function registerUser(input) {
    const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            passwordHash,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
    return user;
}
const JWT_SECRET = process.env.JWT_SECRET;
export async function loginUser(input) {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET_MISSING");
    }
    const user = await prisma.user.findUnique({
        where: { email: input.email.toLowerCase().trim() },
    });
    if (!user || !user.passwordHash) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token,
    };
}
export async function getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return user;
}
//# sourceMappingURL=auth.service.js.map