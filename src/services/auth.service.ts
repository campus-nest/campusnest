import { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "@/src/lib/supabaseClient";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role: "student" | "landlord";
  metadata?: Record<string, any>;
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
            ...input.metadata,
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
   * Sign in a user with email and password
   */
  async signIn(email: string, password: string): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: "No user returned from signin" };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error("Sign in error:", error);
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

  /**
   * Send password reset code to email
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error("sendPasswordResetEmail error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Verify recovery OTP code
   */
  async verifyRecoveryOtp(email: string, token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.verifyOtp({
        email,
        token,
        type: "recovery",
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error("verifyRecoveryOtp error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Update password for the current user
   */
  async updatePassword(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.updateUser({ password });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error("updatePassword error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Resend signup verification email
   */
  async resendSignUpEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error("resendSignUpEmail error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Sign in with Google OAuth using Expo WebBrowser
   */
  async signInWithGoogle(): Promise<{ success: boolean; error?: string; session?: Session }> {
    try {
      const redirectUrl = Linking.createURL("/login");
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data?.url) {
        return { success: false, error: "No OAuth URL returned from Supabase" };
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === "success" && result.url) {
        const parts = result.url.split(/[#?]/);
        const queryString = parts[1] || parts[2] || "";
        const params: Record<string, string> = {};
        queryString.split("&").forEach((param) => {
          const [key, val] = param.split("=");
          if (key && val) {
            params[key] = decodeURIComponent(val);
          }
        });

        const accessToken = params.access_token;
        const refreshToken = params.refresh_token;

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } = await this.supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            return { success: false, error: sessionError.message };
          }

          return { success: true, session: sessionData.session || undefined };
        } else {
          return { success: false, error: "Tokens missing from redirect URL" };
        }
      }

      return { success: false, error: "Sign in was cancelled or failed" };
    } catch (error) {
      console.error("Google OAuth error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
