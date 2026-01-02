import type { IAuthService } from "../../core/ports/IAuthService.ts";
import type { User } from "../../core/domain/User.ts";
import { SupabaseClient } from "@supabase/supabase-js";
import type { ICaptchaService } from "../../core/ports/ICaptchaService.ts";

export class SupabaseAuthAdapter implements IAuthService {
  private supabase: SupabaseClient;
  private captchaService: ICaptchaService;

  constructor(client: SupabaseClient, captchaService: ICaptchaService) {
    this.supabase = client;
    this.captchaService = captchaService;
  }

  private async ensureIsHuman(token: string): Promise<void> {
    const isValid = await this.captchaService.verify(token);
    if (!isValid) {
      throw new Error("Captcha verification failed. Please try again.");
    }
  }

  async logOut(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Supabase sign-out error:", error.message);
      } else {
        console.error("Supabase sign-out error:", error);
      }
      throw new Error("An error occurred during sign-out. Please try again.");
    }
  }

  async signUp(email: string, alias: string, password: string, captchaToken: string): Promise<User> {
    try {
      await this.ensureIsHuman(captchaToken);

      const { data, error } = await this.supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            alias: alias,
          },
        },
      });

      if (error) {
        throw error;
      }
      if (!data.user) {
        throw new Error("No user data returned");
      }
      // Critical check: Ensures strict User type compliance
      if (!data.user.email) {
        throw new Error("No email returned");
      }

      const userAlias = data.user.user_metadata?.alias;
      if (!userAlias || typeof userAlias !== "string") {
        throw new Error("No alias found in metadata");
      }

      return {
        id: data.user.id,
        email: data.user.email, // Guaranteed string now
        alias: userAlias,
      };
    } catch (error) {
      let errorMessage = "An unexpected error occurred during registration.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes("User already registered")) {
        throw new Error("This email is already in use.");
      }
      if (errorMessage.includes("Password should contain")) {
        throw new Error("Password must contain: uppercase letter, lowercase letter, number, and symbol");
      }

      console.error("Supabase signUp error:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
      if (!data.user) {
        throw new Error("No user data returned.");
      }
      // Critical check: Ensures strict User type compliance
      if (!data.user.email) {
        throw new Error("No email returned.");
      }

      const userAlias = data.user.user_metadata?.alias;
      if (!userAlias || typeof userAlias !== "string") {
        throw new Error("No alias found in metadata.");
      }

      return {
        id: data.user.id,
        email: data.user.email, // Guaranteed string now
        alias: userAlias,
      };
    } catch (error) {
      let errorMessage = "An unexpected error occurred during sign-in.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes("Invalid login credentials")) {
        throw new Error("Incorrect email or password.");
      }

      console.error("Supabase signIn error:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
  * Step 1: Send the user an email to get a password reset token.
  * This email contains a link which sends the user back to your application.
  * Refer to the docs for more details: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
  * @param email
  */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      if (email.length === 0) throw new Error("Email is required.");
      const { error } = await this.supabase.auth
        .resetPasswordForEmail(email, {
          redirectTo: globalThis.location.origin + "/reset-password",
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Supabase password reset error:", error.message);
      } else {
        console.error("Supabase password reset error:", error);
      }
      throw new Error("An error occurred during password reset. Please try again.");
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    const { error } = await this.supabase.rpc('delete_user');
    if (error) {
      throw new Error(error.message);
    }
  }
}