import { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "@/src/lib/supabaseClient";

interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role: "student" | "landlord";
}

export class AuthService {
  private supabase = getSupabase();

  /**
   * Get Supabase client instance
   */
  getSupabase() {
    return this.supabase;
  }

  /**
   * Sign up a new user
   */
  async signUp(input: SignUpInput): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          emailRedirectTo: "https://campusnest.uofacs.ca/",
          data: {
            full_name: input.fullName,
            role: input.role,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: "No user returned from signup" };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }

    return data.user;
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    return data.session;
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Get user role from session metadata
   */
  async getUserRole(): Promise<"student" | "landlord" | null> {
    const session = await this.getSession();
    return (
      (session?.user?.user_metadata?.role as "student" | "landlord") ?? null
    );
  }
}

// Export singleton instance
export const authService = new AuthService();
