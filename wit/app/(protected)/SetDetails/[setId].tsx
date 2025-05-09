import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { AuthContext } from "../../../config/authContext";
import colors from "../../../colors.js";

const SetDetails = () => {
  const { setId } = useSearchParams(); // Get the setId from the route
  const { flashcards } = useContext(AuthContext); // Access flashcards from context

  const setFlashcards = flashcards.filter((card) => card.setId === setId); // Filter flashcards for the selected set

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set: {setId}</Text>
      <Text style={styles.subtitle}>Total Cards: {setFlashcards.length}</Text>
      {/* Display flashcards */}
      {setFlashcards.map((card, index) => (
        <View key={card.id} style={styles.card}>
          <Text style={styles.cardText}>Card {index + 1}</Text>
        </View>
      ))}
    </View>
  );
};

export default SetDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.colors.secondary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.colors.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.colors.flashcard,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: colors.colors.text,
  },
});
