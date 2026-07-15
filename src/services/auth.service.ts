import { apiClient } from "@/src/lib/apiClient";
import * as SecureStore from 'expo-secure-store';

interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  role: "student" | "landlord";
  metadata?: Record<string, any>;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(input: SignUpInput): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await apiClient.post('/api/auth/register', {
        ...input,
        ...input.metadata,
      });

      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userRole', user.role);

      return { success: true, user };
    } catch (error: any) {
      console.error("Sign up error:", error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.error || "Unknown error",
      };
    }
  }

  /**
   * Sign in a user with email and password
   */
  async signIn(email: string, password: string): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userRole', user.role);

      return { success: true, user };
    } catch (error: any) {
      console.error("Sign in error:", error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.error || "Invalid credentials",
      };
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<any | null> {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data.user;
    } catch (error) {
      // If unauthorized, return null
      return null;
    }
  }

  /**
   * Get the current session (simulated for legacy compatibility)
   */
  async getSession(): Promise<{ access_token: string } | null> {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) return null;
    return { access_token: token };
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userRole');
      return { success: true };
    } catch (error: any) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user role from secure store
   */
  async getUserRole(): Promise<"student" | "landlord" | null> {
    try {
      const role = await SecureStore.getItemAsync('userRole');
      return (role as "student" | "landlord") ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Send password reset code to email (Not Implemented Yet)
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: "Password reset not yet implemented on custom backend." };
  }

  /**
   * Verify recovery OTP code (Not Implemented Yet)
   */
  async verifyRecoveryOtp(email: string, token: string): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: "OTP verification not yet implemented on custom backend." };
  }

  /**
   * Update password for the current user (Not Implemented Yet)
   */
  async updatePassword(password: string): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: "Update password not yet implemented on custom backend." };
  }

  /**
   * Resend signup verification email (Not Implemented Yet)
   */
  async resendSignUpEmail(email: string): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: "Resend email not yet implemented on custom backend." };
  }
}

// Export singleton instance
export const authService = new AuthService();
