import { PageContainer } from "@/components/page-container";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { getSupabase } from "@/src/lib/supabaseClient";

export default function SignUpScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: "student" | "landlord" }>();

  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  // Student-specific fields
  const [year, setYear] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");

  // Landlord-specific fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    if (!role) {
      Alert.alert("Error", "Missing role. Please go back and select a role.");
      return false;
    }

    // Role-specific validation
    if (role === "student") {
      if (!university || !year || !lookingFor || !budget) {
        Alert.alert("Error", "Please fill in all student-specific fields");
        return false;
      }
    } else if (role === "landlord") {
      if (!phoneNumber || !city || !province) {
        Alert.alert("Error", "Please fill in all landlord-specific fields");
        return false;
      }
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const supabase = getSupabase();

      // Build profile data that will be stored in user metadata
      // The database trigger will create the profile automatically
      const userData: any = {
        full_name: fullName,
        role: role,
        email: email.trim(),
        city,
        province,
        current_address: currentAddress,
      };

      if (role === "student") {
        userData.university = university;
        userData.year = year;
        userData.looking_for = lookingFor;
        userData.budget = budget;
        userData.preferred_location = preferredLocation;
      } else if (role === "landlord") {
        userData.phone_number = phoneNumber;
        userData.property_address = propertyAddress;
      }

      // Sign up the user - the database trigger will create the profile
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: "https://campusnest.uofacs.ca/",
          data: userData,
        },
      });

      if (signUpError) {
        Alert.alert("Sign Up Failed", signUpError.message);
        return;
      }

      Alert.alert(
        "Success",
        "Account created! Please check your email to verify your account.",
        [{ text: "OK", onPress: () => router.replace("/verify-email") }],
      );
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer style={styles.outerContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="light" />

        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join CampusNest as a {role === "student" ? "Student" : "Landlord"}
          </Text>

          <View style={styles.form}>
            {/* Common Fields */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#666"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email *</Text>
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* Student-Specific Fields */}
            {role === "student" && (
              <>
                <Text style={styles.sectionTitle}>Student Information</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>University *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., University of Calgary"
                    placeholderTextColor="#666"
                    value={university}
                    onChangeText={setUniversity}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Year of Study *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 2nd Year, 3rd Year"
                    placeholderTextColor="#666"
                    value={year}
                    onChangeText={setYear}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>What are you looking for? *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 1-bedroom apartment, shared room"
                    placeholderTextColor="#666"
                    value={lookingFor}
                    onChangeText={setLookingFor}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Monthly Budget *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., $800-1200"
                    placeholderTextColor="#666"
                    value={budget}
                    onChangeText={setBudget}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Preferred Location</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Near campus, Downtown"
                    placeholderTextColor="#666"
                    value={preferredLocation}
                    onChangeText={setPreferredLocation}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Current Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your current address"
                    placeholderTextColor="#666"
                    value={currentAddress}
                    onChangeText={setCurrentAddress}
                  />
                </View>

                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="City"
                      placeholderTextColor="#666"
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>Province</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Province"
                      placeholderTextColor="#666"
                      value={province}
                      onChangeText={setProvince}
                    />
                  </View>
                </View>
              </>
            )}

            {/* Landlord-Specific Fields */}
            {role === "landlord" && (
              <>
                <Text style={styles.sectionTitle}>Landlord Information</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., (403) 123-4567"
                    placeholderTextColor="#666"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Property Location</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Main property location"
                    placeholderTextColor="#666"
                    value={propertyAddress}
                    onChangeText={setPropertyAddress}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Current Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your current address"
                    placeholderTextColor="#666"
                    value={currentAddress}
                    onChangeText={setCurrentAddress}
                  />
                </View>

                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>City *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="City"
                      placeholderTextColor="#666"
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>Province *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Province"
                      placeholderTextColor="#666"
                      value={province}
                      onChangeText={setProvince}
                    />
                  </View>
                </View>
              </>
            )}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </Pressable>

            {Platform.OS === "android" && (
              <Pressable onPress={() => router.back()}>
                <Text style={styles.backText}>Back</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "#000",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
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
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
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
  rowContainer: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
  backText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    opacity: 0.7,
  },
});
