import type { IAuthService } from "../../core/ports/IAuthService";
import type { User } from "../../core/domain/User";
import { SupabaseClient } from "@supabase/supabase-js";

/**

 * * Following Clean Architecture principles, this Adapter acts as the "plugin"
 * that connects our application's core logic to a specific external tool (Supabase).
 * * Its primary responsibilities are:
 * 1. To "translate" the generic method calls (like `signIn`) into the specific
 * API calls required by Supabase (e.g., `supabase.auth.signInWithPassword`).
 * 2. To perform "Error Translation": catching low-level Supabase errors
 * and re-throwing user-friendly ones.
 */ export class SupabaseAuthAdapter implements IAuthService {
  private supabase: SupabaseClient;
  constructor(client: SupabaseClient) {
    this.supabase = client;
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
      const { data, error } = await this.supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            alias: alias,
            captchaToken: captchaToken
          },
        },
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
      if (errorMessage.includes("Password")) {
        throw new Error(
          "The password is too weak. Please use a stronger password."
        );
      }

      console.error("Supabase signUp error:", errorMessage);
      throw new Error(errorMessage); // Display a generic error message
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
}
