import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../colors.js";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { useFonts } from "expo-font";
import { AuthContext } from "../../../config/authContext"; // Adjust the path if needed

const settings = () => {
  const router = useRouter();
  const authcontext = useContext(AuthContext);
  

  const handleLogout = () => {
    authcontext.logOut();
  };

  const [fontsLoaded] = useFonts({
      CustomFont: require("../../../assets/fonts/RobotoMono-Regular.ttf"),
    });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={[styles.logoutButtonText, { fontFamily: "CustomFont" }]}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default settings;

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

  logoutButton: {
    backgroundColor: "#7E99A3", // Light blue color
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    width: "100%", // Full width
    maxWidth: 300, // Optional: Limit the button width
    marginTop: 20,
  },

  logoutButtonText: {
    color: "#FFFFFF", // White text color
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "RobotoMono-Regular", // Use the specified font
  },
});