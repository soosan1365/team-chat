export type RoomMember = {
  userId: string;
  roomId: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
  };
};

export type Room = {
  id: string;
  name: string;
  createdAt: string;
  _count: {
    members: number;
  };
  members: RoomMember[];
  isMember: boolean;
};
