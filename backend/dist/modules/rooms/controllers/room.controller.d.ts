import type { Request, Response } from "express";
export declare function getRoomsController(req: Request, res: Response): Promise<void>;
export declare function joinRoomController(req: Request<{
    roomId: string;
}>, res: Response): Promise<void>;
export declare function leaveRoomController(req: Request<{
    roomId: string;
}>, res: Response): Promise<void>;
//# sourceMappingURL=room.controller.d.ts.map