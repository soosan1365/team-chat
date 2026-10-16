export declare function getRoomMessages(roomId: string): Promise<({
    replyTo: ({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        content: string;
        userId: string;
        roomId: string;
        createdAt: Date;
        type: string;
        audioUrl: string | null;
        fileUrl: string | null;
        fileName: string | null;
        replyToId: string | null;
    }) | null;
    user: {
        id: string;
        name: string;
    };
} & {
    id: string;
    content: string;
    userId: string;
    roomId: string;
    createdAt: Date;
    type: string;
    audioUrl: string | null;
    fileUrl: string | null;
    fileName: string | null;
    replyToId: string | null;
})[]>;
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
export declare function createMessage(input: CreateMessageInput): Promise<{
    replyTo: ({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        content: string;
        userId: string;
        roomId: string;
        createdAt: Date;
        type: string;
        audioUrl: string | null;
        fileUrl: string | null;
        fileName: string | null;
        replyToId: string | null;
    }) | null;
    user: {
        id: string;
        name: string;
    };
} & {
    id: string;
    content: string;
    userId: string;
    roomId: string;
    createdAt: Date;
    type: string;
    audioUrl: string | null;
    fileUrl: string | null;
    fileName: string | null;
    replyToId: string | null;
}>;
export declare function updateMessage(messageId: string, userId: string, roomId: string, content: string): Promise<{
    replyTo: ({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        content: string;
        userId: string;
        roomId: string;
        createdAt: Date;
        type: string;
        audioUrl: string | null;
        fileUrl: string | null;
        fileName: string | null;
        replyToId: string | null;
    }) | null;
    user: {
        id: string;
        name: string;
    };
} & {
    id: string;
    content: string;
    userId: string;
    roomId: string;
    createdAt: Date;
    type: string;
    audioUrl: string | null;
    fileUrl: string | null;
    fileName: string | null;
    replyToId: string | null;
}>;
export declare function markRoomAsRead(userId: string, roomId: string): Promise<{
    userId: string;
    roomId: string;
    joinedAt: Date;
    lastReadAt: Date | null;
}>;
export declare function getUnreadMessagesCount(userId: string): Promise<number>;
export declare function deleteMessage(messageId: string, userId: string, roomId: string): Promise<{
    id: string;
    content: string;
    userId: string;
    roomId: string;
    createdAt: Date;
    type: string;
    audioUrl: string | null;
    fileUrl: string | null;
    fileName: string | null;
    replyToId: string | null;
}>;
export {};
//# sourceMappingURL=message.service.d.ts.map