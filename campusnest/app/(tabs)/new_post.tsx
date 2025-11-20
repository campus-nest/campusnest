import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function NewPostScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-2">New post Screen</Text>
      <Text className="text-base text-[#666]">Create your new post here</Text>
    </View>
  );
}
