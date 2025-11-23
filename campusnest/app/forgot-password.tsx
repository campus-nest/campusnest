import { PageContainer } from "@/components/page-container";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email address");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

            if (error) {
                Alert.alert("Error", error.message);
            } else {
                // Generic success message for security, or specific if preferred
                Alert.alert(
                    "Check your email",
                    "If an account exists for this email, you will receive a password reset code.",
                    [
                        {
                            text: "Enter Code",
                            onPress: () =>
                                router.push({
                                    pathname: "/enter-code",
                                    params: { email: email.trim() },
                                }),
                        },
                    ]
                );
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.content}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </Pressable>

                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email to receive a reset code
                </Text>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#666"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <Pressable
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSendCode}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Sending..." : "Send Code"}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    backButton: {
        position: "absolute",
        top: 60,
        left: 30,
        zIndex: 10,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
        opacity: 0.8,
    },
    title: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 40,
        textAlign: "center",
        opacity: 0.8,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        color: "#fff",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#333",
    },
    button: {
        backgroundColor: "#fff",
        borderRadius: 100,
        padding: 16,
        alignItems: "center",
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
});
