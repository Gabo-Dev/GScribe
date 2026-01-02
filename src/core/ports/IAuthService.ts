import type { User } from "../domain/User.ts";

export interface IAuthService {
    /**
     * Signs up a new user in the system
     * @param email 
     * @param alias public name of the user
     * @param password 
     * @returns A Promise that resolves with the new User object
     */
    signUp(email: string, alias: string, password: string, captchaToken: string): Promise<User>;

    /**
     * Signs in a user in the system
     * @param email 
     * @param password 
     * @returns A Promise that resolves with the new User object
     */
    signIn(email: string, password: string): Promise<User>;

    /**
     * Signs out  the currently authenticated user.
     * If sign-out fails, it throws an error.
     * @returns A Promise that resolves with no value (`void`) on success.
     */
    logOut(): Promise<void>;
    
    /**
     * Sends a email to let Supabase know that the user wants to reset their password.
     * @param email The email address to send link to reset password
     * @returns A Promise that resolves with no value (`void`) on success.
     */
    sendPasswordResetEmail(email: string): Promise<void>;

    /**
     * Updates the user's password
     * @param newPassword The new password to set
     */
    updatePassword(newPassword: string): Promise<void>;

    /**
     * Deletes the user's account
     * 
    */
    deleteAccount(): Promise<void>;
}