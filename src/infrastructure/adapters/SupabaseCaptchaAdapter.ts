import type { ICaptchaService } from "../../core/ports/ICaptchaService.ts";

/**
 * Adapter implementation for the Captcha Service using Supabase Edge Functions.
 * * This class acts as a bridge between the core application and the serverless backend.
 * * Security Note:
 * Although the Edge Function is public, Supabase's API Gateway requires a valid
 * API Key (Authorization Header) to route the request. We use the 'anon' key here
 * as this operation occurs before the user is fully authenticated.
 */
export class SupabaseCaptchaAdapter implements ICaptchaService {
    private readonly endpointUrl: string;
    private readonly anonKey: string;
    constructor(endpointUrl: string, anonKey: string) {
        if (!endpointUrl) {
            console.warn("SupabaseCaptchaAdapter: Endpoint URL is missing.");
        }
        if (!anonKey) {
            console.warn("SupabaseCaptchaAdapter: Anon key is missing.");
        }
        this.endpointUrl = endpointUrl;
        this.anonKey = anonKey;
    }

    async verify(token: string): Promise<boolean> {
        try {
            const response = await fetch(this.endpointUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.anonKey}`,
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                console.error(`Captcha request failed with status:", ${response.status}`);
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
