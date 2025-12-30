
import type { IAuthService } from "../../core/ports/IAuthService.ts";
import { Validators } from "../../core/utils/Validators.ts";

export class SendPasswordResetEmailUseCase {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    async execute(email: string): Promise<void> {
        if (!Validators.isValidEmail(email)) throw new Error("Invalid email");
        
        return await this.authService.sendPasswordResetEmail(email);
    }
}