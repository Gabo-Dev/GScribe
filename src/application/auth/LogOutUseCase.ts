import type { IAuthService } from "../../core/ports/IAuthService";

export class LogOutUseCase {
    private authService: IAuthService;
    constructor(authService: IAuthService) {
        this.authService = authService;
    }
    /**
     * Executes the log-out use case.
     * @returns A Promise that resolves with no value (`void`) on success.
     */
    async execute(): Promise<void> {
        return await this.authService.logOut();
    }
}