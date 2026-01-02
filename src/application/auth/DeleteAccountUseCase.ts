import type { IAuthService } from "../../core/ports/IAuthService.ts";

export class DeleteAccountUseCase {
    private authService: IAuthService;
    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    async execute(): Promise<void> {
        return await this.authService.deleteAccount();
    }
}
