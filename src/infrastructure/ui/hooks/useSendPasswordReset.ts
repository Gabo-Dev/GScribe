import { useState } from "react";
import { sendPasswordResetEmailUseCase } from "../../../dependencies.ts";

export const useSendPasswordReset = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSendEmail = async (email: string) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await sendPasswordResetEmailUseCase.execute(email);
            setSuccess("Email has been sent to reset your password.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error could not send password reset email.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }
    return {
        isLoading,
        error,
        success,
        handleSendEmail
    };
}