import HomeIcon from "@/assets/images/nav_bar/Home.svg";
import PlusIcon from "@/assets/images/nav_bar/PlusCircle.svg";
import SearchIcon from "@/assets/images/nav_bar/Search.svg";
import UserIcon from "@/assets/images/nav_bar/User.svg";
import UsersIcon from "@/assets/images/nav_bar/Users.svg";
import { usePathname, useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated (in tabs routes)
  const isAuthenticated = ![
    "/landing",
    "/login",
    "/signup",
    "/pre-signup",
    "/verify-email",
  ].includes(pathname);

  // Helper function to check if route is active
  const isActive = (route: string) => {
    if (route === "/(tabs)") {
      return pathname === "/" || pathname === "/(tabs)";
    }
    return pathname === route || pathname === `/(tabs)${route}`;
  };

  if (Platform.OS === "web") {
    // Web - Top navigation bar
    return (
      <View className="h-[60px] bg-black flex-row justify-between items-center px-5 border-b border-[#333]">
        <Pressable onPress={() => router.push("/landing")}>
          <Text className="text-white text-xl font-bold">🏠 CampusNest</Text>
        </Pressable>

        <View className="flex-row gap-5">
          {isAuthenticated ? (
            <>
              <Button
                variant={isActive("/(tabs)") ? "secondary" : "ghost"}
                onPress={() => router.push("/(tabs)")}
              >
                <Text className={isActive("/(tabs)") ? "font-bold" : ""}>
                  Home
                </Text>
              </Button>
              <Button
                variant={isActive("/explore") ? "secondary" : "ghost"}
                onPress={() => router.push("/(tabs)/explore")}
              >
                <Text className={isActive("/explore") ? "font-bold" : ""}>
                  Search
                </Text>
              </Button>
              <Button
                variant={isActive("/new_post") ? "secondary" : "ghost"}
                onPress={() => router.push("/(tabs)/new_post")}
              >
                <Text className={isActive("/new_post") ? "font-bold" : ""}>
                  New Post
                </Text>
              </Button>
              <Button
                variant={isActive("/users") ? "secondary" : "ghost"}
                onPress={() => router.push("/(tabs)/users")}
              >
                <Text className={isActive("/users") ? "font-bold" : ""}>
                  Users
                </Text>
              </Button>
              <Button
                variant={isActive("/profile") ? "secondary" : "ghost"}
                onPress={() => router.push("/(tabs)/profile")}
              >
                <Text className={isActive("/profile") ? "font-bold" : ""}>
                  Profile
                </Text>
              </Button>
            </>
          ) : (
            <>
              {pathname !== "/login" && pathname !== "/signup" && (
                <>
                  <Button
                    variant="ghost"
                    onPress={() => router.push("/login")}
                  >
                    <Text>Login</Text>
                  </Button>
                  <Button
                    variant="ghost"
                    onPress={() => router.push("/signup")}
                  >
                    <Text>Sign Up</Text>
                  </Button>
                </>
              )}
            </>
          )}
        </View>
      </View>
    );
  }

  // Mobile - Bottom navigation bar (only show when authenticated)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <View className="absolute bottom-5 left-5 right-5 h-[70px] bg-white flex-row justify-around items-center rounded-[35px] shadow-lg">
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Home"
        className="items-center justify-center p-2"
        onPress={() => router.push("/(tabs)")}
      >
        <HomeIcon
          width={24}
          height={24}
          color={isActive("/(tabs)") ? "#888" : "#000"}
        />
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Search"
        className="items-center justify-center p-2"
        onPress={() => router.push("/(tabs)/explore")}
      >
        <SearchIcon
          width={24}
          height={24}
          color={isActive("/explore") ? "#888" : "#000"}
        />
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="New Post"
        className="items-center justify-center p-2"
        onPress={() => router.push("/(tabs)/new_post")}
      >
        <PlusIcon
          width={24}
          height={24}
          color={isActive("/new_post") ? "#888" : "#000"}
        />
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Users"
        className="items-center justify-center p-2"
        onPress={() => router.push("/(tabs)/users")}
      >
        <UsersIcon
          width={24}
          height={24}
          color={isActive("/users") ? "#888" : "#000"}
        />
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Profile"
        className="items-center justify-center p-2"
        onPress={() => router.push("/(tabs)/profile")}
      >
        <UserIcon
          width={24}
          height={24}
          color={isActive("/profile") ? "#888" : "#000"}
        />
      </Pressable>
    </View>
  );
}
