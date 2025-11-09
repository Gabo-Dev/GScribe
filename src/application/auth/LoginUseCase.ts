import type { IAuthService } from "../../core/ports/IAuthService";
import type { User } from "../../core/domain/User";

export class LoginUseCase {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    async execute(email:string, password: string): Promise<User> {
        return await this.authService.signIn(email, password);
    }
}