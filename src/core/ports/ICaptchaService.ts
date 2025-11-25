export interface ICaptchaService {
    /**
     * Verifies if the provided token is valid.
     * @param token The token string received from the captcha widget.
     * @return Promise resolving to true if the token is valid, false otherwise.
     */
    verify(token: string): Promise<boolean>;
}