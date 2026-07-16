import Home from "@/assets/images/nav_bar/home_icon.svg";
import CreateListing from "@/assets/images/nav_bar/create_listing.svg";
import SearchListing from "@/assets/images/nav_bar/search_listing.svg";
import Profile from "@/assets/images/nav_bar/profile.svg";
import Users from "@/assets/images/nav_bar/users_icon.svg";
import { usePathname, useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/src/constants/theme";

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
      <View style={styles.webContainer}>
        <Pressable onPress={() => router.push("/landing")}>
          <Text style={styles.logo}>🏠 CampusNest</Text>
        </Pressable>

        <View style={styles.webNav}>
          {isAuthenticated ? (
            <>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Home"
                onPress={() => router.push("/(tabs)")}
                style={[
                  styles.webNavItem,
                  isActive("/(tabs)") && styles.webNavItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.webNavLink,
                    isActive("/(tabs)") && styles.webNavLinkActive,
                  ]}
                >
                  Home
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Search"
                onPress={() => router.push("/(tabs)/explore")}
                style={[
                  styles.webNavItem,
                  isActive("/explore") && styles.webNavItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.webNavLink,
                    isActive("/explore") && styles.webNavLinkActive,
                  ]}
                >
                  Search
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="New Post"
                onPress={() => router.push("/(tabs)/new_post")}
                style={[
                  styles.webNavItem,
                  isActive("/new_post") && styles.webNavItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.webNavLink,
                    isActive("/new_post") && styles.webNavLinkActive,
                  ]}
                >
                  New Post
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Users"
                onPress={() => router.push("/(tabs)/users")}
                style={[
                  styles.webNavItem,
                  isActive("/users") && styles.webNavItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.webNavLink,
                    isActive("/users") && styles.webNavLinkActive,
                  ]}
                >
                  Users
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Profile"
                onPress={() => router.push("/(tabs)/profile")}
                style={[
                  styles.webNavItem,
                  isActive("/profile") && styles.webNavItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.webNavLink,
                    isActive("/profile") && styles.webNavLinkActive,
                  ]}
                >
                  Profile
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {pathname !== "/login" && pathname !== "/signup" && (
                <>
                  <Pressable
                    onPress={() => router.push("/login")}
                    style={styles.webNavItem}
                  >
                    <Text style={styles.webNavLink}>Login</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push("/signup")}
                    style={styles.webNavItem}
                  >
                    <Text style={styles.webNavLink}>Sign Up</Text>
                  </Pressable>
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
    <View style={styles.mobileContainer}>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Home"
        style={styles.navItem}
        onPress={() => router.push("/(tabs)")}
      >
        <Home
          width={24}
          height={24}
          color={isActive("/(tabs)") ? colors.accent.primary : colors.text.secondary}
        />
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Search"
        style={styles.navItem}
        onPress={() => router.push("/(tabs)/explore")}
      >
        <SearchListing
          width={24}
          height={24}
          color={isActive("/explore") ? colors.accent.primary : colors.text.secondary}
        />
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="New Post"
        style={styles.navItem}
        onPress={() => router.push("/(tabs)/new_post")}
      >
        <CreateListing
          width={24}
          height={24}
          color={isActive("/new_post") ? colors.accent.primary : colors.text.secondary}
        />
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Users"
        style={styles.navItem}
        onPress={() => router.push("/(tabs)/users")}
      >
        <Users
          width={24}
          height={24}
          color={isActive("/users") ? colors.accent.primary : colors.text.secondary}
        />
      </Pressable>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Profile"
        style={styles.navItem}
        onPress={() => router.push("/(tabs)/profile")}
      >
        <Profile
          width={24}
          height={24}
          color={isActive("/profile") ? colors.accent.primary : colors.text.secondary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Web styles
  webContainer: {
    height: 60,
    backgroundColor: colors.background.screen,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.strong,
  },
  logo: {
    color: colors.white,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  webNav: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  webNavItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
  },
  webNavItemActive: {
    backgroundColor: colors.border.strong,
  },
  webNavLink: {
    color: colors.white,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  webNavLinkActive: {
    fontWeight: typography.weight.bold,
    textDecorationLine: "underline",
  },

  // Mobile styles
  mobileContainer: {
    position: "absolute",
    bottom: spacing.xl,
    alignSelf: "center",
    width: "90%",
    maxWidth: 480,
    height: 70,
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 35,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
  },
});
