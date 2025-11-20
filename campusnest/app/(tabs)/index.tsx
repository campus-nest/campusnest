import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-2">Welcome to CampusNest!</Text>
      <Text className="text-base text-[#666]">You are logged in</Text>
    </View>
  );
}
