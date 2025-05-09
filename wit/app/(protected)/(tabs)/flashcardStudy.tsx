import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AuthContext } from "../../../config/authContext";
import colors from "../../../colors.js";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas"; // Import ReactSketchCanvas

const FlashcardStudy = () => {
  const { setId } = useLocalSearchParams(); // Use useLocalSearchParams to get the setId
  const { flashcards, backHome } = useContext(AuthContext); // Correctly use AuthContext
  const router = useRouter();

  // Ensure setId is a string and filter flashcards for the selected set
  const setFlashcards = flashcards.filter((card) => card.setId === String(setId)); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const frontCanvasRef = useRef<ReactSketchCanvasRef>(null);
  const backCanvasRef = useRef<ReactSketchCanvasRef>(null);

  useEffect(() => {
    // Load the front and back paths into the canvas when the currentIndex changes
    if (setFlashcards[currentIndex]) {
      const { front, back } = setFlashcards[currentIndex];
      if (frontCanvasRef.current) {
        frontCanvasRef.current.clearCanvas();
        frontCanvasRef.current.loadPaths(front);
      }
      if (backCanvasRef.current) {
        backCanvasRef.current.clearCanvas();
        backCanvasRef.current.loadPaths(back);
      }
    }
  }, [currentIndex, setFlashcards]);

  const handleFlip = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  };

  const handleNext = () => {
    if (currentIndex < setFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const flipRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const flipOpacityFront = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const flipOpacityBack = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const maxFlashcardWidth = screenWidth * 0.8;
  const maxFlashcardHeight = screenHeight * 0.7;

  const adjustedFlashcardWidth = Math.min(maxFlashcardWidth, (maxFlashcardHeight * 5) / 3);
  const adjustedFlashcardHeight = adjustedFlashcardWidth * (3 / 5);

  const sideIndicatorTop = screenHeight * 0.07; // Adjust dynamically based on screen height
  const setIdPositionTop = screenHeight * 0.03; // Adjust dynamically for setId position

  if (setFlashcards.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButtonTop} onPress={backHome}>
          <Ionicons name="arrow-back" size={24} color={colors.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.message}>No flashcards found for this set.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButtonTop} onPress={backHome}>
        <Ionicons name="arrow-back" size={24} color={colors.colors.darktext} />
      </TouchableOpacity>

      {/* Set ID */}
      <Text
        style={[
          styles.setIdText,
          { top: setIdPositionTop },
        ]}
      >
        {setId}
      </Text>

      {/* Side Indicator */}
      <Text
        style={[
          styles.sideIndicator,
          { top: sideIndicatorTop },
        ]}
      >
        {isFlipped ? "Back" : "Front"} - {currentIndex + 1}/{setFlashcards.length}
      </Text>

      <View
        style={[
          styles.flashcard,
          {
            width: adjustedFlashcardWidth,
            height: adjustedFlashcardHeight,
          },
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: flipOpacityFront, transform: [{ rotateX: flipRotation }] },
            isFlipped ? { zIndex: -1 } : { zIndex: 1 },
          ]}
        >
          <ReactSketchCanvas
            ref={frontCanvasRef}
            style={StyleSheet.absoluteFill}
            strokeWidth={4}
            strokeColor="#000"
            canvasColor={colors.colors.flashcard}
            allowOnlyPointerType="all"
          />
        </Animated.View>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: flipOpacityBack,
              transform: [{ rotateX: flipRotation }, { scaleY: -1 }],
            },
            isFlipped ? { zIndex: 1 } : { zIndex: -1 },
          ]}
        >
          <ReactSketchCanvas
            ref={backCanvasRef}
            style={StyleSheet.absoluteFill}
            strokeWidth={4}
            strokeColor="#000"
            canvasColor={colors.colors.flashcard}
            allowOnlyPointerType="all"
          />
        </Animated.View>
      </View>
      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" /> {/* Back Arrow */}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFlip} style={styles.flipButton}>
          <Ionicons name="swap-horizontal" size={24} color="#fff" /> {/* Flip Icon */}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
          <Ionicons name="arrow-forward" size={24} color="#fff" /> {/* Forward Arrow */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FlashcardStudy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colors.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.colors.secondary,
    marginBottom: 20,
  },
  flashcard: {
    borderRadius: 35,
    backgroundColor: colors.colors.flashcard,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: "hidden",
  },
  flashcardContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  flashcardText: {
    fontSize: 18,
    color: colors.colors.text,
    textAlign: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center", // Center the buttons
    alignItems: "center",
    marginTop: 20,
  },
  navButton: {
    backgroundColor: colors.colors.primary,
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Add shadow
    shadowColor: "#000", // Add shadow color
    shadowOffset: { width: 0, height: 2 }, // Add shadow offset
    shadowOpacity: 0.3, // Add shadow opacity
    shadowRadius: 4, // Add shadow radius
    marginHorizontal: 100, // Increased margin between buttons
  },
  flipButton: {
    backgroundColor: colors.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginHorizontal: 100, // Increased margin between buttons
  },
  message: {
    fontSize: 18,
    color: colors.colors.text,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  backButtonTop: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "transparent", // Match the style from AddFlashcard/_layout
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  setIdText: {
    position: "absolute",
    color: "rgba(255, 255, 255, 0.81)",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 2,
  },
  sideIndicator: {
    position: "absolute",
    color: colors.colors.secondary, // Updated text color
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 2,
  },
});
