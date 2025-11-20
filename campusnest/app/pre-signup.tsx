import { PageContainer } from "@/components/page-container";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, View, Platform } from "react-native";
import LandingTopHome from "../assets/images/landing_page_top_home.svg";
import PreSignUpBottomHouse from "../assets/images/pre_sign_up_bottom_house.svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PreSignUpScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState
    "student" | "landlord" | null
  >(null);

  const handleCreateAccount = () => {
    if (!selectedRole) {
      return;
    }

    router.push({
      pathname: "/signup",
      params: { role: selectedRole },
    });
  };

  return (
    <PageContainer className="bg-black">
      <StatusBar style="light" />
      <View className="flex-1 bg-black items-center pt-[60px] px-5">
        {/* Back Button, only show on android */}
        {Platform.OS === "android" && (
          <Pressable
            className="absolute top-[60px] left-5 w-10 h-10 justify-center items-center z-10"
            onPress={() => router.back()}
          >
            <Text className="text-white text-[28px] font-light">←</Text>
          </Pressable>
        )}

        {/* Logo */}
        <View className="mt-10 mb-8">
          <LandingTopHome width={96} height={96} fill="none" />
        </View>

        {/* Title */}
        <Text className="text-white text-[28px] font-medium mb-[50px] text-center">
          Select a Role!
        </Text>

        {/* Role Selector */}
        <View className="w-full max-w-[300px] mb-8 relative z-[100]">
          <Label nativeID="role" className="text-white text-sm font-medium mb-2">
            Enter Role
          </Label>
          <Select
            value={
              selectedRole
                ? { value: selectedRole, label: selectedRole === "student" ? "Student" : "Landlord" }
                : undefined
            }
            onValueChange={(option) => {
              if (option) {
                setSelectedRole(option.value as "student" | "landlord");
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                className="text-white"
                placeholder="Choose role"
              />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectGroup>
                <SelectItem label="Student" value="student">
                  Student
                </SelectItem>
                <SelectItem label="Landlord" value="landlord">
                  Landlord
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>

        {/* Create Account Button */}
        <Button
          onPress={handleCreateAccount}
          disabled={!selectedRole}
          className="rounded-full py-4 px-10 min-w-[200px] mb-8"
        >
          <Text>Create Account</Text>
        </Button>

        {/* House Illustration */}
        <View className="absolute bottom-5 self-center">
          <PreSignUpBottomHouse fill="none" />
        </View>
      </View>
    </PageContainer>
  );
}
