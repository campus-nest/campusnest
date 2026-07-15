import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { authService, profileService } from "@/src/services";

export function useCompleteProfile() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role: "student" | "landlord" }>();

  const [role, setRole] = useState<"student" | "landlord" | null>(null);

  useEffect(() => {
    if (params.role) {
      setRole(params.role);
    }
  }, [params.role]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Common address fields
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

  useEffect(() => {
    const loadSessionInfo = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          setEmail(session.user.email || "");
          setFullName(session.user.user_metadata?.full_name || "");
        } else {
          Alert.alert("Session Error", "No active session found. Please login again.", [
            { text: "OK", onPress: () => router.replace("/login") },
          ]);
        }
      } catch (err) {
        console.error("Error loading session in complete profile:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadSessionInfo();
  }, [router]);

  const validateForm = () => {
    if (!role) {
      Alert.alert("Error", "Please select a role");
      return false;
    }

    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }

    if (role === "student") {
      if (!university.trim() || !year.trim() || !lookingFor.trim() || !budget.trim()) {
        Alert.alert("Error", "Please fill in all student-specific fields (University, Year, Looking For, Budget)");
        return false;
      }
    }

    if (role === "landlord") {
      if (!phoneNumber.trim() || !city.trim() || !province.trim()) {
        Alert.alert("Error", "Please fill in phone number, city, and province");
        return false;
      }
    }

    return true;
  };

  const handleCompleteProfile = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const session = await authService.getSession();
      if (!session?.user) {
        Alert.alert("Error", "No user session found. Please login again.");
        router.replace("/login");
        return;
      }

      const userId = session.user.id;

      // Prepare metadata update for Supabase auth
      const metadataUpdates: Record<string, any> = {
        role,
        full_name: fullName.trim(),
      };

      // Call supabase auth update user metadata
      const { error: metadataError } = await authService
        .getSupabase()
        .auth.updateUser({ data: metadataUpdates });

      if (metadataError) {
        console.error("Error updating user metadata:", metadataError);
        Alert.alert("Error", "Failed to update auth metadata: " + metadataError.message);
        return;
      }

      // Create profile details in profiles database table
      const profileData: any = {
        full_name: fullName.trim(),
        role,
        email: email.trim(),
        current_address: currentAddress.trim() || null,
        city: city.trim() || null,
        province: province.trim() || null,
      };

      if (role === "student") {
        Object.assign(profileData, {
          university: university.trim(),
          year: year.trim(),
          looking_for: lookingFor.trim(),
          budget: budget.trim(),
          preferred_location: preferredLocation.trim() || null,
        });
      } else {
        Object.assign(profileData, {
          phone_number: phoneNumber.trim(),
          property_address: propertyAddress.trim() || null,
        });
      }

      const { success, error: profileError } = await profileService.createProfile(userId, profileData);

      if (!success || profileError) {
        Alert.alert("Profile Creation Failed", profileError || "Failed to save profile in database.");
        return;
      }

      Alert.alert("Success", "Profile completed successfully!", [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => router.replace("/(tabs)"), 100);
          },
        },
      ]);
    } catch (err) {
      console.error("CompleteProfile error:", err);
      Alert.alert("Error", "An unexpected error occurred while completing your profile.");
    } finally {
      setLoading(false);
    }
  };

  return {
    role,
    setRole,
    fullName,
    setFullName,
    email,
    setEmail,
    loading,
    initialLoading,
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
    handleCompleteProfile,
  };
}
