export declare function createDefaultRooms(): Promise<void>;
export declare function getRooms(userId?: string): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    isMember: boolean;
    _count: {
        members: number;
    };
    members: ({
        user: {
            id: string;
            name: string;
        };
    } & {
        userId: string;
        roomId: string;
        joinedAt: Date;
        lastReadAt: Date | null;
    })[];
}[]>;
export declare function isUserRoomMember(userId: string, roomId: string): Promise<boolean>;
export declare function joinRoom(userId: string, roomId: string): Promise<{
    userId: string;
    roomId: string;
    joinedAt: Date;
    lastReadAt: Date | null;
}>;
export declare function leaveRoom(userId: string, roomId: string): Promise<{
    userId: string;
    roomId: string;
    joinedAt: Date;
    lastReadAt: Date | null;
}>;
//# sourceMappingURL=room.service.d.ts.map