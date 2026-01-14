import LandingTopHome from "@/assets/images/landing_page_top_home.svg";
import { StyleSheet, View, ViewStyle } from "react-native";

interface LogoProps {
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
}

export default function Logo({ size = "medium", style }: LogoProps) {
  const dimensions = {
    small: { width: 64, height: 64 },
    medium: { width: 96, height: 96 },
    large: { width: 128, heiinterface LogoProps {
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
}
ght: 128 },
  };

  const { width, height } = dimensions[size];

  return (
    <View style={[styles.container, style]}>
      <LandingTopHome width={width} height={height} fill="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

