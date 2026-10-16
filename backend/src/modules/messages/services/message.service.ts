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
      },replyTo: {
  include: {
    user: {
      select: {
        id: true,
        name: true,
      },
    },
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
replyToId?: string | null;
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
      replyToId: input.replyToId ?? null,
    },
   include: {
  user: {
    select: {
      id: true,
      name: true,
    },
  },
  replyTo: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
},
  });
}
export async function updateMessage(
  messageId: string,
  userId: string,
  roomId: string,
  content: string,
) {
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      userId,
      roomId,
      type: "text",
    },
  });

  if (!message) {
    throw new Error("Message not found or unauthorized");
  }

  return prisma.message.update({
    where: { id: messageId },
    data: { content },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      replyTo: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
export async function markRoomAsRead(
  userId: string,
  roomId: string,
) {
  return prisma.roomMember.update({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
    data: {
      lastReadAt: new Date(),
    },
  });
}
export async function getUnreadMessagesCount(userId: string) {
  const memberships = await prisma.roomMember.findMany({
    where: { userId },
    select: {
      roomId: true,
      joinedAt: true,
      lastReadAt: true,
    },
  });

  const counts = await Promise.all(
    memberships.map((membership) =>
      prisma.message.count({
        where: {
          roomId: membership.roomId,
          userId: { not: userId },
          createdAt: {
            gt: membership.lastReadAt ?? membership.joinedAt,
          },
        },
      }),
    ),
  );

  return counts.reduce((total, count) => total + count, 0);
}
export async function deleteMessage(
  messageId: string,
  userId: string,
  roomId: string,
) {
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      userId,
      roomId,
    },
    select: {
      id: true,
    },
  });

  if (!message) {
    throw new Error("Message not found or unauthorized");
  }

  return prisma.message.delete({
    where: {
      id: messageId,
    },
  });
}