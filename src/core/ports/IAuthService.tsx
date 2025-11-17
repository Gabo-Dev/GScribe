import type { User } from "../domain/User";

export interface IAuthService {
    /**
     * Signs up a new user in the system
     * @param email 
     * @param alias public name of the user
     * @param password 
     * @param captchaToken The verification token from reCAPTCHA
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
     * Signs in a user anonymously (Guest Mode).
     * If signs-in fails, it throws an user-friendly error.
     * @returns A Promise that resolves with the new (anonymous) User object
     */
    signInAnonymously(captchaToken: string): Promise<User>;
}