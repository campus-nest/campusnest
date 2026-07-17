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
      const response = await apiClient.post('/api/auth/users', {
        ...input,
        ...input.metadata,
      });

      const { token, user } = response.data.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userRole', user.role);

      return { success: true, user };
    } catch (error: any) {
      console.error("Sign up error:", error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.error?.message || "Unknown error",
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
    code?: string;
  }> {
    try {
      const response = await apiClient.post('/api/auth/sessions', {
        email,
        password,
      });

      const { token, user } = response.data.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userRole', user.role);

      return { success: true, user };
    } catch (error: any) {
      console.error("Sign in error:", error.response?.data || error);
      const errorData = error.response?.data?.error;
      return {
        success: false,
        error: errorData?.message || "Invalid credentials",
        code: errorData?.code,
      };
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<any | null> {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data.data.user;
    } catch {
      // If unauthorized, return null
      return null;
    }
  }

  /**
   * Get the current session — fast, local-only check.
   * Only checks if a JWT token exists in SecureStore.
   * Use getCurrentUser() when you need the full user object.
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
   * Send password reset OTP to email
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/api/auth/otps', { email, type: 'password_reset' });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || "Failed to send reset email",
      };
    }
  }

  /**
   * Verify recovery OTP code and receive a temporary reset token
   */
  async verifyRecoveryOtp(
    email: string,
    token: string,
  ): Promise<{ success: boolean; resetToken?: string; error?: string }> {
    try {
      const response = await apiClient.post('/api/auth/otps/verifications', {
        email,
        code: token,
        type: 'password_reset',
      });
      return {
        success: true,
        resetToken: response.data.data.reset_token,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || "Invalid OTP",
      };
    }
  }

  /**
   * Update password for the current user using a verified reset token
   */
  async updatePassword(
    password: string,
    resetToken: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.put('/api/auth/passwords', { password, resetToken });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || "Failed to update password",
      };
    }
  }

  /**
   * Resend signup verification email
   */
  async resendSignUpEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/api/auth/otps', { email, type: 'email_verification' });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || "Failed to resend verification email",
      };
    }
  }

  /**
   * Verify email verification OTP
   */
  async verifyEmailOtp(
    email: string,
    code: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/api/auth/otps/verifications', {
        email,
        code,
        type: 'email_verification',
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || "Invalid verification code",
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

