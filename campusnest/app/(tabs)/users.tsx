import { StyleSheet, Text, View } from "react-native";

export default function UsersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Users Screen</Text>
      <Text style={styles.subtext}>Browse and connect with users here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: "#666",
  },
});
