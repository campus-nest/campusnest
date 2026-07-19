import { useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { authService } from "@/src/services";
import { notifyAuthChanged } from "@/app/_layout";

export function useSignUp() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: "student" | "landlord" }>();

  // Common fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  // Student specific fields
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");

  // Landlord specific fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!role) {
      Alert.alert("Error", "Missing role. Please go back and select a role.");
      return false;
    }

    if (!fullName || !email || !password || !confirmPassword) {
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

    if (role === "student") {
      if (!university || !year || !lookingFor || !budget) {
        Alert.alert("Error", "Please fill in all student-specific fields");
        return false;
      }
    }

    if (role === "landlord") {
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
      const metadata: Record<string, any> = {
        city,
        province,
        current_address: currentAddress,
      };

      if (role === "student") {
        Object.assign(metadata, {
          university,
          year,
          looking_for: lookingFor,
          budget,
          preferred_location: preferredLocation,
        });
      }

      if (role === "landlord") {
        Object.assign(metadata, {
          phone_number: phoneNumber,
          property_address: propertyAddress,
        });
      }

      const { success, error } = await authService.signUp({
        email: email.trim(),
        password,
        fullName,
        role: role as "student" | "landlord",
        metadata,
      });

      if (!success || error) {
        Alert.alert("Sign Up Failed", error || "Unknown error occurred.");
        return;
      }

      Alert.alert(
        "Success",
        "Account created successfully!",
        [{ text: "OK", onPress: () => {
          router.replace({ pathname: "/verify-email", params: { email: email.trim() } });
        } }]
      );
    } catch (err) {
      console.error("SignUp error:", err);
      Alert.alert("Error", "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return {
    role,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    currentAddress,
    setCurrentAddress,
    city,
    setCity,
    province,
    setProvince,
    university,
    setUniversity,
    year,
    setYear,
    lookingFor,
    setLookingFor,
    budget,
    setBudget,
    preferredLocation,
    setPreferredLocation,
    phoneNumber,
    setPhoneNumber,
    propertyAddress,
    setPropertyAddress,
    loading,
    handleSignUp,
  };
}
