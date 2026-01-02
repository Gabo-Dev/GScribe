import type { IAuthService } from "../../core/ports/IAuthService.ts";

export class DeleteAccountUseCase {
    private authService: IAuthService;
    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    async execute(): Promise<void> {
         await this.authService.deleteAccount();

         try {
            await this.authService.logOut();
        } catch (e) {
            console.warn("Account deleted. Error logging out.", e);
        }
    }
}
