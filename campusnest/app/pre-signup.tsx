import { PageContainer } from "@/components/page-container";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import LandingTopHome from "../assets/images/landing_page_top_home.svg";
import PreSignUpBottomHouse from "../assets/images/pre_sign_up_bottom_house.svg";

export default function PreSignUpScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<
    "student" | "landlord" | null
  >(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCreateAccount = () => {
    if (!selectedRole) {
      return;
    }

    router.push({
      pathname: "/signup",
      params: { role: selectedRole },
    });
  };

  const getRoleDisplayText = () => {
    if (selectedRole === "student") return "Student";
    if (selectedRole === "landlord") return "Landlord";
    return "Choose role";
  };

  return (
    <PageContainer style={styles.outerContainer}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Back Button, only show on android */}
        {Platform.OS === "android" && (
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        )}

        {/* Logo */}
        <View style={styles.logoContainer}>
          <LandingTopHome width={96} height={96} fill="none" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Select a Role!</Text>

        {/* Role Selector */}
        <View style={styles.roleSection}>
          <Text style={styles.label}>Enter Role</Text>
          <Pressable
            style={styles.roleInput}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.roleInputText}>{getRoleDisplayText()}</Text>
          </Pressable>

          {/* Dropdown */}
          {showDropdown && (
            <View style={styles.dropdown}>
              <Pressable
                style={[
                  styles.dropdownOption,
                  selectedRole === "student" && styles.dropdownOptionSelected,
                ]}
                onPress={() => {
                  setSelectedRole("student");
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>Student</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.dropdownOption,
                  selectedRole === "landlord" && styles.dropdownOptionSelected,
                ]}
                onPress={() => {
                  setSelectedRole("landlord");
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>Landlord</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Create Account Button */}
        <Pressable
          style={[
            styles.createButton,
            !selectedRole && styles.createButtonDisabled,
          ]}
          onPress={handleCreateAccount}
          disabled={!selectedRole}
        >
          <Text style={styles.createButtonText}>Create Account</Text>
        </Pressable>

        {/* House Illustration */}
        <View style={styles.bottomHouseContainer}>
          <PreSignUpBottomHouse fill="none" />
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backArrow: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "300",
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 50,
    textAlign: "center",
  },
  roleSection: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 30,
    position: "relative",
    zIndex: 100,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  roleInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleInputText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  dropdownOptionSelected: {
    backgroundColor: "#3a3a3a",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#fff",
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: 200,
    alignItems: "center",
    marginBottom: 30,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomHouseContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});
