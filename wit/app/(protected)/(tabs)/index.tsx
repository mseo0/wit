import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../colors.js";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchUsername } from "../../../cosmos/apiService";
import { useFonts } from "expo-font"; // Import useFonts
import * as SplashScreen from 'expo-splash-screen';


const home = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    RobotoMono: require("../../../assets/fonts/RobotoMono-Regular.ttf"), // Load the font
  });

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

  if (!fontsLoaded) {
    SplashScreen.setOptions({
          duration: 1000,
          fade: true,
        });
  }

  return (
    <View style={styles.container}>
      {/* Display the username */}
      <Text style={styles.welcomeText}>Welcome Matthew</Text>

      {/* Horizontal line with text "Sets" */}
      <View style={styles.setsContainer}>
        <Text style={styles.setsText}>Sets</Text>
        <View style={styles.horizontalLine} />
      </View>

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
    justifyContent: "flex-start", // Align content to the top
    alignItems: "center",
    backgroundColor: colors.colors.background, // Use theme background
    paddingTop: 100, // Increase padding to move content further down
  },

  welcomeText: {
    fontSize: 50, // Larger font size
    fontWeight: "bold",
    fontFamily: "RobotoMono", // Use RobotoMono font
    color: colors.colors.secondary, // Change font color to secondary
    marginBottom: 20, // Adjust spacing below the text
    textAlign: "left", // Align text to the left
    width: "100%", // Ensure the text spans the full width
    paddingHorizontal: 100, // Add padding for better alignment
  },

  loadingText: {
    fontSize: 18,
    color: colors.colors.text,
    fontFamily: "RobotoMono", // Use RobotoMono font for loading text
  },

  setsContainer: {
    flexDirection: "row", // Align text and line horizontally
    alignItems: "center",
    width: "100%", // Full width
    paddingHorizontal: 100, // Add padding for alignment
    marginTop: 20, // Add spacing above
  },

  setsText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "RobotoMono", // Use RobotoMono font
    color: colors.colors.secondary, // Change text color to secondary
    marginRight: 20, // Add spacing between text and line
  },

  horizontalLine: {
    width: "60%", // Reduce the width of the line
    height: 3, // Line thickness
    backgroundColor: colors.colors.secondary, // Line color
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