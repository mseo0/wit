import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../colors.js";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchUsername, fetchFlashcardSets } from "../../../cosmos/apiService"; // Import API service to fetch sets
import { useFonts } from "expo-font"; // Import useFonts
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext } from "../../../config/authContext";

const home = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [flashcardSets, setFlashcardSets] = useState<{ setId: string; count: number }[]>([]); // Initialize with explicit type

  const [fontsLoaded] = useFonts({
    RobotoMono: require("../../../assets/fonts/RobotoMono-Regular.ttf"), // Load the font
  });

  const { flashcards, flashcardCount } = useContext(AuthContext); // Access flashcardCount from context

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

  useEffect(() => {
    const getFlashcardSets = async () => {
      try {
        const sets = await fetchFlashcardSets(); // Fetch saved flashcard sets
        setFlashcardSets(sets);
      } catch (error) {
        console.error("Failed to fetch flashcard sets:", error);
      }
    };

    getFlashcardSets();
  }, []);

  useEffect(() => {
    const loadFlashcardSets = () => {
      const sets = flashcards.reduce<{ setId: string; count: number }[]>((acc, card) => {
        const existingSet = acc.find((set) => set.setId === card.setId);
        if (existingSet) {
          existingSet.count += 1; // Increment the count for the existing set
        } else {
          acc.push({ setId: card.setId, count: 1 }); // Add a new set with an initial count of 1
        }
        return acc;
      }, []);
      console.log("Derived flashcard sets:", sets); // Debug log to verify the sets
      setFlashcardSets(sets);
    };

    loadFlashcardSets();
  }, [flashcards]);

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

      {/* Flashcard sets */}
      <View style={styles.flashcardSetsContainer}>
        {flashcardSets.map((set) => (
          <TouchableOpacity
            key={set.setId}
            style={styles.flashcardSetBox}
            onPress={() => router.push(`./flashcardStudy?setId=${set.setId}`)} // Navigate to flashcardStudy with setId
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.colors.primary} // Darken on hover
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"} // Reset on hover out
          >
            <Text style={styles.flashcardSetCount}>Cards: {set.count}</Text>
            <Text style={styles.flashcardSetText}>{set.setId}</Text>
          </TouchableOpacity>
        ))}
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

  flashcardSetsContainer: {
    width: "100%",
    paddingHorizontal: 100,
    marginTop: 20,
    flexDirection: "column", // Stack containers vertically
    gap: 20, // Add spacing between containers
  },
  flashcardSetBox: {
    borderWidth: 5, // Add border
    borderColor: colors.colors.secondary, // Set border color to primary
    backgroundColor: "transparent", // Make the background transparent
    padding: 15,
    borderRadius: 15,
    width: "80%", // Adjust width to leave equal margins on the sides
    marginHorizontal: "10%", // Center horizontally with equal margins
    marginTop: 20, // Move the box down
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center content vertically
    shadowColor: "transparent", // Remove shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Remove elevation
  },
  flashcardSetText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "RobotoMono",
    color: colors.colors.secondary,
    marginBottom: 5,
  },
  flashcardSetCount: {
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "RobotoMono",
    color: colors.colors.secondary,
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