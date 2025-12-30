interface ValidationResult {
    isValid: boolean,
    message: string
}
export class Validators {
    // WC3 standard
    private static readonly EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


    /**
     * Verify if the email is valid
     * @param email 
     * @returns boolean
     */
    public static isValidEmail(email: string): boolean {
        if (!email) return false;
        return this.EMAIL_REGEX.test(email);
    }

    /** 
     * Verify if the password is valid 
     * Using Fail Fast pattern
     * @param password 
     * @returns boolean
     */
    public static isValidPassword(password: string): ValidationResult {
        if(!password) return {isValid: false, message: "Password is required."};
        if(password.length < 8) return {isValid: false, message: "Password must be at least 8 characters."};
        if(!/[A-Z]/.test(password)) return {isValid: false, message: "Password must contain at least one uppercase letter."};
        if(!/[a-z]/.test(password)) return {isValid: false, message: "Password must contain at least one lowercase letter."};
        if(!/[0-9]/.test(password)) return {isValid: false, message: "Password must contain at least one number."};
        if(!/[!@#$%^&*()_+\-=[\]{};':"|,.<>?~`]/.test(password)) return {isValid: false, message: "Password must contain at least one special character."};
        return {isValid: true, message: ""};
    }
}