import type { IAuthService } from "../../core/ports/IAuthService.ts";
import { Validators } from "../../core/utils/Validators.ts";

export class UpdatePasswordUseCase {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    async execute(newPassword: string): Promise<void> {
        const result = Validators.isValidPassword(newPassword);

        if (!result.isValid) throw new Error(result.message);
        
        return await this.authService.updatePassword(newPassword);
    }
}