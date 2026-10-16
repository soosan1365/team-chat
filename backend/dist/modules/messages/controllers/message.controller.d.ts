import type { Request, Response } from "express";
export declare function getRoomMessagesController(req: Request<{
    roomId: string;
}>, res: Response): Promise<void>;
export declare function createMessageController(req: Request<{
    roomId: string;
}, unknown, {
    content: string;
    replyToId?: string | null;
}>, res: Response): Promise<void>;
export declare function updateMessageController(req: Request<{
    roomId: string;
    messageId: string;
}, unknown, {
    content: string;
}>, res: Response): Promise<void>;
export declare function deleteMessageController(req: Request<{
    roomId: string;
    messageId: string;
}>, res: Response): Promise<void>;
export declare function createAudioMessageController(req: Request<{
    roomId: string;
}>, res: Response): Promise<void>;
export declare function createAttachmentMessageController(req: Request<{
    roomId: string;
}>, res: Response): Promise<void>;
export declare function markRoomAsReadController(req: Request<{
    roomId: string;
}>, res: Response): Promise<void>;
export declare function getUnreadMessagesCountController(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=message.controller.d.ts.map