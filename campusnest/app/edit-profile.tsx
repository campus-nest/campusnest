import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "@/src/lib/supabaseClient";
import { useRouter } from "expo-router";
import { Profile } from "@/src/types/profile";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, Upload } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);

    // Form state
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState<"student" | "landlord">("student");
    const [university, setUniversity] = useState("");
    const [year, setYear] = useState("");
    const [currentAddress, setCurrentAddress] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null); // Local URI for preview

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.replace("/");
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                Alert.alert("Error", "Could not fetch profile data.");
            } else if (data) {
                setProfile(data);
                setFullName(data.full_name || "");
                setRole(data.role || "student");
                setUniversity(data.university || "");
                setYear(data.year || "");
                setCurrentAddress(data.current_address || "");
                setCity(data.city || "");
                setProvince(data.province || "");
                setEmail(data.email || "");
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setLoading(false);
        }
    }

    async function pickImage() {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Could not pick image.");
        }
    }

    async function uploadAvatar(userId: string, uri: string): Promise<string | null> {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileExt = uri.split(".").pop();
            const fileName = `${userId}.${fileExt}`; // Overwrite existing file for simplicity or use timestamp
            const filePath = `${fileName}`;

            // Upsert to replace if exists
            const { error: uploadError } = await supabase.storage
                .from("profile_photos")
                .upload(filePath, blob, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("profile_photos").getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error("Error uploading avatar:", error);
            Alert.alert("Error", "Could not upload profile picture.");
            return null;
        }
    }

    async function handleSave() {
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            let finalAvatarUrl = avatarUrl;

            if (imageUri) {
                const uploadedUrl = await uploadAvatar(user.id, imageUri);
                if (uploadedUrl) {
                    finalAvatarUrl = uploadedUrl;
                }
            }

            const updates: Partial<Profile> = {
                full_name: fullName,
                role,
                university,
                year,
                current_address: currentAddress,
                city,
                province,
                email,
                avatar_url: finalAvatarUrl,
                // updated_at: new Date().toISOString(), // If you have this column
            };

            const { error } = await supabase
                .from("profiles")
                .update(updates)
                .eq("id", user.id);

            if (error) {
                throw error;
            }

            Alert.alert("Success", "Profile updated successfully!");
            router.back();
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "Could not update profile.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft color="white" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit Profile</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.avatar} />
                            ) : avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarPlaceholderText}>No Image</Text>
                                </View>
                            )}
                            <View style={styles.editIconContainer}>
                                <Upload color="white" size={16} />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Enter your full name"
                                placeholderTextColor="#71717a"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Role</Text>
                            <View style={styles.roleContainerReadOnly}>
                                <Text style={styles.roleTextReadOnly}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </Text>
                                <Text style={styles.roleNote}>(Cannot be changed)</Text>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>University</Text>
                            <TextInput
                                style={styles.input}
                                value={university}
                                onChangeText={setUniversity}
                                placeholder="University Name"
                                placeholderTextColor="#71717a"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Year</Text>
                            <TextInput
                                style={styles.input}
                                value={year}
                                onChangeText={setYear}
                                placeholder="e.g. 2nd Year"
                                placeholderTextColor="#71717a"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Current Address</Text>
                            <TextInput
                                style={styles.input}
                                value={currentAddress}
                                onChangeText={setCurrentAddress}
                                placeholder="Street Address"
                                placeholderTextColor="#71717a"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>City</Text>
                                <TextInput
                                    style={styles.input}
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="City"
                                    placeholderTextColor="#71717a"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Province</Text>
                                <TextInput
                                    style={styles.input}
                                    value={province}
                                    onChangeText={setProvince}
                                    placeholder="Province"
                                    placeholderTextColor="#71717a"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email Address"
                                placeholderTextColor="#71717a"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    safeArea: {
        flex: 1,
        backgroundColor: "black",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 16, // Added padding to match profile page
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        backgroundColor: "white",
        borderRadius: 9999,
        paddingHorizontal: 24,
        marginBottom: 24,
        marginTop: 8,
    },
    backButton: {
        // padding: 8, // Removed extra padding to align better in pill
    },
    headerTitle: {
        color: "black", // Changed to black
        fontSize: 18,
        fontWeight: "bold",
    },
    avatarSection: {
        alignItems: "center",
        marginVertical: 24,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#27272a",
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#27272a",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarPlaceholderText: {
        color: "#a1a1aa",
        fontSize: 12,
    },
    editIconContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#3b82f6", // blue-500
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "black",
    },
    changePhotoText: {
        color: "#3b82f6",
        fontSize: 14,
        fontWeight: "600",
    },
    form: {
        paddingHorizontal: 8, // Reduced since scrollContent has padding
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: "#a1a1aa",
        fontSize: 14,
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#27272a",
        borderRadius: 12,
        padding: 16,
        color: "white",
        fontSize: 16,
    },
    row: {
        flexDirection: "row",
    },
    roleContainerReadOnly: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#27272a",
        borderRadius: 12,
        padding: 16,
        justifyContent: "space-between",
    },
    roleTextReadOnly: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    roleNote: {
        color: "#71717a",
        fontSize: 12,
        fontStyle: "italic",
    },
    saveButton: {
        backgroundColor: "white",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
    },
});
