import type { IAuthService } from "../../core/ports/IAuthService";
import type { User } from "../../core/domain/User";

export class SignInAnonymouslyUseCase {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    /**
     * Executes the anonymous sign-in use case.
     * @returns A Promise that resolves with the new Anonymous User object.
     */
    async execute(captchaToken: string): Promise<User> {
        return await this.authService.signInAnonymously(captchaToken);
    }
}