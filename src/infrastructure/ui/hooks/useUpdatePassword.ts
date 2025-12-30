import { useState } from "react";
import { updatePasswordUseCase } from "../../../dependencies.ts";

export const useUpdatePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleUpdatePassword = async ( newPassword: string) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await updatePasswordUseCase.execute(newPassword);
            setSuccess("Password has been updated.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error could not update password.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        error,
        success,
        handleUpdatePassword
    }
}
