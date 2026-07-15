import { IUserDocument } from '../models/User';
import { RegisterInput, LoginInput } from '../utils/validation';
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        token: string;
        user: any;
    }>;
    login(data: LoginInput): Promise<{
        token: string;
        user: any;
    }>;
    getCurrentUser(userId: string): Promise<IUserDocument | null>;
}
export declare const authService: AuthService;
//# sourceMappingURL=AuthService.d.ts.map