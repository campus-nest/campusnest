import { StyleSheet, Text, View } from "react-native";

export default function NewPostScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>New post Screen</Text>
      <Text style={styles.subtext}>Create your new post here</Text>
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
