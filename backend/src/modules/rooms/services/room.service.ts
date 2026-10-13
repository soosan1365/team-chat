
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
