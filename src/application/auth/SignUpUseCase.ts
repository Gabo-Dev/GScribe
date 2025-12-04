import type { User } from "../../core/domain/User.tsx";
import type { IAuthService } from "../../core/ports/IAuthService.ts";

export class SignUpUseCase {
    private authService: IAuthService;
    constructor(authService: IAuthService) {
        this.authService = authService;
    }
    /**
     * Executes the sign-up use case.
     * @param email User's email address.
     * @param alias User's public name.
     * @param password User's password.
     * @returns A Promise that resolves with the new User object.
     */
    async execute(email: string, alias: string, password: string, captchaToken: string): Promise<User> {
        return await this.authService.signUp(email, alias, password, captchaToken);
    }
}