//ذخیره پیام در دیتابیس و گرفتن پیام‌های قبلی
import { prisma } from "../../../lib/prisma.js";

export async function getRoomMessages(roomId: string) {
  return prisma.message.findMany({
    where: { roomId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

type CreateMessageInput = {
  content: string;
  userId: string;
  roomId: string;
};

export async function createMessage(input: CreateMessageInput) {
  return prisma.message.create({
    data: {
      content: input.content,
      userId: input.userId,
      roomId: input.roomId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
