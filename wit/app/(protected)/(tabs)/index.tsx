import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../colors.js";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchUsername } from "../../../cosmos/apiService";

const home = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const fetchedUsername = await fetchUsername();
        setUsername(fetchedUsername);
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };

    getUsername();
  }, []);

  return (
    <View style={styles.container}>
      {/* Display the username */}
      <Text style={styles.text}>
        {username ? `Welcome, ${username}!` : "Loading..."}
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.fcAdd}
        onPress={() => router.push("./AddFlashcard/flashcardDraw")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colors.background, // Use theme background
  },

  text: {
    fontSize: 18,
    color: colors.colors.text,
  },

  fcAdd: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});