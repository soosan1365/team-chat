
import { prisma } from "../../../lib/prisma.js";

export async function createDefaultRooms() {
  await prisma.room.createMany({
    data: [
      { name: "General" },
      { name: "Development" },
    ],
    skipDuplicates: true,
  });

  console.log("Default rooms are ready");
}
export async function getRooms(userId?: string) {
  const rooms = await prisma.room.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { members: true },
      },
      members: {
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

  return rooms.map((room) => ({
    ...room,
   isMember: userId
  ? room.members.some((member) => member.userId === userId)
  : false,
  }));
}
export async function isUserRoomMember(
  userId: string,
  roomId: string,
) {
  const membership = await prisma.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
    select: {
      userId: true,
    },
  });

  return membership !== null;
}
export async function joinRoom(userId: string, roomId: string) {
  return prisma.roomMember.upsert({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
    update: {},
    create: {
      userId,
      roomId,
    },
  });
}