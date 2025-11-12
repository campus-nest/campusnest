import { PageContainer } from '@/components/page-container';
import { supabase } from '@/src/lib/supabaseClient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleResendEmail = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to resend verification email');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Icon/Emoji */}
          <Text style={styles.icon}>📧</Text>

          {/* Title */}
          <Text style={styles.title}>Check Your Email</Text>

          {/* Description */}
          <Text style={styles.description}>
            We&apos;ve sent a verification link to your email address. Please check your inbox and
            click the link to verify your account.
          </Text>

          {/* Resend Section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendText}>Didn&apos;t receive the email?</Text>
            <Pressable
              onPress={handleResendEmail}
              disabled={loading}
              style={({ pressed }) => [
                styles.resendButton,
                pressed && styles.resendButtonPressed,
                loading && styles.resendButtonDisabled,
              ]}
            >
              <Text style={styles.resendButtonText}>
                {loading ? 'Sending...' : 'Resend Email'}
              </Text>
            </Pressable>
          </View>

          {/* Input for resend */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email address:</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Back to Login */}
          <Pressable
            onPress={() => router.replace('/login')}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </Pressable>
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  resendSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  resendButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  resendButtonPressed: {
    opacity: 0.7,
    backgroundColor: '#333',
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    textDecoration: 'underline',
  },
});
