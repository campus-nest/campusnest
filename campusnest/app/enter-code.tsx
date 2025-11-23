import { PageContainer } from "@/components/page-container";
import { supabase } from "@/src/lib/supabaseClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function EnterCodeScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerifyCode = async () => {
        if (!code.trim()) {
            Alert.alert("Error", "Please enter the verification code");
            return;
        }

        if (!email) {
            Alert.alert("Error", "Email address missing. Please try again.");
            router.back();
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: code.trim(),
                type: "recovery",
            });

            if (error) {
                Alert.alert("Error", error.message);
            } else {
                router.replace("/reset-password");
            }
        } catch (error) {
            console.error("Verify code error:", error);
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

                <Text style={styles.title}>Enter Code</Text>
                <Text style={styles.subtitle}>
                    Enter the 6-digit code sent to {email}
                </Text>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Verification Code</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123456"
                            placeholderTextColor="#666"
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </View>

                    <Pressable
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleVerifyCode}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Verifying..." : "Verify Code"}
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
        fontSize: 24,
        borderWidth: 1,
        borderColor: "#333",
        textAlign: "center",
        letterSpacing: 8,
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
