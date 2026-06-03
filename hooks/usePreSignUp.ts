import { useState } from "react";
import { useRouter } from "expo-router";

export function usePreSignUp() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"student" | "landlord" | null>(null);

  const handleCreateAccount = () => {
    if (!selectedRole) return;
    router.push({ pathname: "/signup", params: { role: selectedRole } });
  };

  return {
    selectedRole,
    setSelectedRole,
    handleCreateAccount,
  };
}
