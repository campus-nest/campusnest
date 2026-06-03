import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingStateProps {
  label: string;
  showSpinner?: boolean;
}

export default function LoadingState({
  label,
  showSpinner = true,
}: LoadingStateProps) {
  return (
    <View style={styles.container}>
      {showSpinner && <ActivityIndicator color="#fff" />}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
});
