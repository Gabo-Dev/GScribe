import { useState } from "react";
import { deleteAccountUseCase } from "../../../dependencies.ts";

export const useDeleteAccount = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError(null);
        setSuccess(null);

        try {
            await deleteAccountUseCase.execute();
            setSuccess("Account has been deleted.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error could not delete account.";
            setError(message);
        } finally {
            setIsDeleting(false);
        }
    }

    return {
        isDeleting,
        error,
        success,
        handleDeleteAccount
    }
}