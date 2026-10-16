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
  type?: string;
  audioUrl?: string | null;
  fileUrl?: string | null;
fileName?: string | null;
};

export async function createMessage(input: CreateMessageInput) {
  return prisma.message.create({
    data: {
      content: input.content,
      userId: input.userId,
      roomId: input.roomId,
      type: input.type ?? "text",
      audioUrl: input.audioUrl ?? null,
      fileUrl: input.fileUrl ?? null,
      fileName: input.fileName ?? null,
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
