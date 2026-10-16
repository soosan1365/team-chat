type RegisterInput = {
    name: string;
    email: string;
    password: string;
};
export declare function registerUser(input: RegisterInput): Promise<{
    createdAt: Date;
    email: string;
    id: string;
    name: string;
}>;
export declare function loginUser(input: {
    email: string;
    password: string;
}): Promise<{
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}>;
export declare function getCurrentUser(userId: string): Promise<{
    createdAt: Date;
    email: string;
    id: string;
    name: string;
}>;
export {};
//# sourceMappingURL=auth.service.d.ts.map