//ذخیره پیام در دیتابیس و گرفتن پیام‌های قبلی
import { prisma } from "../../../lib/prisma.js";
export async function getRoomMessages(roomId) {
    return prisma.message.findMany({
        where: { roomId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            }, replyTo: {
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
export async function createMessage(input) {
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
export async function updateMessage(messageId, userId, roomId, content) {
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
export async function markRoomAsRead(userId, roomId) {
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
export async function getUnreadMessagesCount(userId) {
    const memberships = await prisma.roomMember.findMany({
        where: { userId },
        select: {
            roomId: true,
            joinedAt: true,
            lastReadAt: true,
        },
    });
    const counts = await Promise.all(memberships.map((membership) => prisma.message.count({
        where: {
            roomId: membership.roomId,
            userId: { not: userId },
            createdAt: {
                gt: membership.lastReadAt ?? membership.joinedAt,
            },
        },
    })));
    return counts.reduce((total, count) => total + count, 0);
}
export async function deleteMessage(messageId, userId, roomId) {
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
//# sourceMappingURL=message.service.js.map