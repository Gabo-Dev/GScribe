import type { IAuthService } from "../../core/ports/IAuthService.ts";
import type { User } from "../../core/domain/User.tsx";
import { SupabaseClient } from "@supabase/supabase-js";
import type { ICaptchaService } from "../../core/ports/ICaptchaService.ts";

/**
 * * Following Clean Architecture principles, this Adapter acts as the "plugin"
 * that connects our application's core logic to a specific external tool (Supabase).
 * * Its primary responsibilities are:
 * 1. To "translate" the generic method calls (like `signIn`) into the specific
 * API calls required by Supabase (e.g., `supabase.auth.signInWithPassword`).
 * 2. To perform "Error Translation": catching low-level Supabase errors
 * and re-throwing user-friendly ones.
 */
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
        console.error("Supabase sign-out error:", error.message); // For the developer
      } else {
        console.error("Supabase sign-out error:", error);
      }

      throw new Error("An error occurred during sign-out. Please try again."); // For the user
    }
  }

  async signUp(email: string, alias: string, password: string, captchaToken: string): Promise<User> {
    try {
      await this.ensureIsHuman(captchaToken);
      console.log("🔵 [DEBUG] Intentando registrar:", email);
      const { data, error } = await this.supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            alias: alias,
          },
        },
      });
      console.log("🟡 [DEBUG] Respuesta cruda de Supabase:", { 
        userID: data.user?.id, 
        userEmail: data.user?.email,
        errorObject: error,
        errorCode: error?.code,
        errorMessage: error?.message
      });
      if (error) {
        throw error;
      }
      if (!data.user) {
        throw new Error("No user data returned");
      }
      if (!data.user.email) {
        throw new Error("No  email returned");
      }

      const userAlias = data.user.user_metadata?.alias;
      if (!userAlias || typeof userAlias !== "string") {
        throw new Error("No alias found in metadata");
      }

      return {
        id: data.user.id,
        email: data.user.email,
        alias: userAlias,
      };
    } catch (error) {
      // --- Type Guard & Error Translation ---
      let errorMessage = "An unexpected error occurred during registration.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Specific error handling
      if (errorMessage.includes("User already registered")) {
        throw new Error("This email is already in use.");
      }
      if (errorMessage.includes("Password should contain")) {
        throw new Error("Password must contain: uppercase letter, lowercase letter, number, and symbol");
      }

      console.error("Supabase signUp error:", errorMessage);
      throw new Error(errorMessage); // Display a generic error message
    }
  }
  async signIn(email: string, password: string): Promise<User> {
    console.log('[Adapter] Input recibido:', { email, password });
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      console.log('🔍 [SignIn] Respuesta:', { data, error });
      if (error) {
        throw error;
      }
      if (!data.user) {
        throw new Error("No user data returned.");
      }
      if (!data.user.email) {
        throw new Error("No email returned.");
      }

      const userAlias = data.user.user_metadata?.alias;
      if (!userAlias || typeof userAlias !== "string") {
        throw new Error("No alias found in metadata.");
      }

      return {
        id: data.user.id,
        email: data.user.email,
        alias: userAlias,
      };
    } catch (error) {
      // --- Type Guard & Error Translation ---
      let errorMessage = "An unexpected error occurred during sign-in.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Specific error handling
      if (errorMessage.includes("Invalid login credentials")) {
        throw new Error("Incorrect email or password.");
      }

      console.error("Supabase signIn error:", errorMessage);
      throw new Error(errorMessage); // Display a generic error message
    }
  }
  async signInAnonymously(captchaToken: string): Promise<User> {
    try {
      await this.ensureIsHuman(captchaToken);
      const { data, error } = await this.supabase.auth.signInAnonymously();
      if (error) throw error;

      // --- Guard Clause ---
      if (!data.user) {
        throw new Error("Anonymous sign-in failed.");
      }

      return {
        id: data.user.id,
        email: null,
        alias: null,
      };
    } catch (error) {
      // --- Type Guard & Error Translation ---
      let errorMessage = "An unexpected error occurred during guest sign-in.";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Supabase anonymous sign-in error:", error.message);
        console.log("supabase error", error);
      } else {
        console.error("Supabase anonymous sign-in error (unknown):", error);
      }
      throw new Error(errorMessage);
    }
  }
}
