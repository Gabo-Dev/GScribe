import type { ICaptchaService } from "../../core/ports/ICaptchaService.ts";

export class SupabaseCaptchaAdapter implements ICaptchaService {
    private readonly endpointUrl: string;
    constructor(endpointUrl: string) {
        if (!endpointUrl) {
            console.warn("SupabaseCaptchaAdapter: Endpoint URL is missing.");
        }
        this.endpointUrl = endpointUrl;
    }

    async verify(token: string): Promise<boolean> {
        try {
            const response = await fetch(this.endpointUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.success === true;
        } catch (error) {
            console.error("Captcha verification error:", error);
            return false;
        }
    }
}
