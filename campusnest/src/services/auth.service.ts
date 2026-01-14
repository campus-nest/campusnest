import { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "@/src/lib/supabaseClient";

export class AuthService {
  private supabase = getSupabase();

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
    return (session?.user?.user_metadata?.role as "student" | "landlord") ?? null;
  }
}

// Export singleton instance
export const authService = new AuthService();