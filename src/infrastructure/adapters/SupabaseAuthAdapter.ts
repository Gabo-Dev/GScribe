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

      console.log('[Adapter] Input recibido:',
        {
          email,
          alias,
          password,
          captchaToken: captchaToken ? `present (${captchaToken.substring(0, 10)}...)` : 'MISSING'
          });

      const { data, error } = await this.supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            alias: alias,
          },
          captchaToken: captchaToken
        },
      });

      console.log('🔍 [Adapter] Respuesta de Supabase:', {
      tieneUsuario: !!data?.user,
      tieneError: !!error,
      error: error ? {
        mensaje: error.message,
        nombre: error.name,
        status: error.status
      } : 'No hay error',
      usuario: data?.user ? {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata
      } : 'No hay usuario'
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
  async signInAnonymously(captchaToken: string): Promise<User>{
    try {
      const { data, error } = await this.supabase.auth.signInAnonymously({
        options:{captchaToken}
      });
      if(error) throw error;

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
