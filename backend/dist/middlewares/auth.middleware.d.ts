import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): void;
export declare function optionalAuthenticateToken(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map