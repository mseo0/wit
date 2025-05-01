import React, { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import Slider from "@react-native-community/slider";
import colors from "../../../colors.js";
import { useFonts } from "expo-font";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Ionicons } from "@expo/vector-icons";

const createFlash = () => {
  const [flashcards, setFlashcards] = useState([{ id: 1 }]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [showPopup, setShowPopup] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const frontCanvasRefs = useRef([]);
  const backCanvasRefs = useRef([]);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  };

  const addFlashcard = async () => {
    if (isFlipped) {
      await new Promise((resolve) => {
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setIsFlipped(false);
          resolve();
        });
      });
    }

    const updatedFlashcards = [...flashcards];

    const frontData = await frontCanvasRefs.current[currentCardIndex]?.exportPaths();
    const backData = await backCanvasRefs.current[currentCardIndex]?.exportPaths();

    updatedFlashcards[currentCardIndex] = {
      id: flashcards[currentCardIndex]?.id || currentCardIndex + 1,
      front: frontData || [],
      back: backData || [],
    };

    updatedFlashcards.push({ id: updatedFlashcards.length + 1, front: [], back: [] });

    frontCanvasRefs.current[currentCardIndex]?.clearCanvas();
    backCanvasRefs.current[currentCardIndex]?.clearCanvas();

    setFlashcards(updatedFlashcards);
    setCurrentCardIndex(updatedFlashcards.length - 1);
    setIsEraserMode(false);
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

  const [fontsLoaded] = useFonts({
    CustomFont: require("../../../assets/fonts/RobotoMono-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const maxFlashcardWidth = screenWidth * 0.8;
  const maxFlashcardHeight = screenHeight * 0.7;

  const adjustedFlashcardWidth = Math.min(maxFlashcardWidth, (maxFlashcardHeight * 5) / 3);
  const adjustedFlashcardHeight = adjustedFlashcardWidth * (3 / 5);

  return (
    <View style={styles.container}>
      <Text style={styles.sideIndicator}>
        {isFlipped ? "Back" : "Front"} - {currentCardIndex + 1}/{flashcards.length}
      </Text>

      <View style={styles.slidersAndButtonsRow}>
        <View
          style={[
            styles.sliderContainer,
            { width: adjustedFlashcardWidth * 0.3 },
          ]}
        >
          {showPopup && (
            <View style={styles.popup}>
              <Text style={[styles.popupText, { fontFamily: "CustomFont" }]}>
                {(strokeWidth - 2).toFixed(1)}
              </Text>
            </View>
          )}
          <Slider
            style={[styles.slider, { height: 30 }]}
            minimumValue={2}
            maximumValue={9}
            step={0.5}
            value={strokeWidth}
            onValueChange={(value) => {
              setStrokeWidth(value);
              setShowPopup(true);

              if (isFlipped && backCanvasRefs.current[currentCardIndex]) {
                backCanvasRefs.current[currentCardIndex].eraseMode(isEraserMode);
              } else if (!isFlipped && frontCanvasRefs.current[currentCardIndex]) {
                frontCanvasRefs.current[currentCardIndex].eraseMode(isEraserMode);
              }
            }}
            onSlidingComplete={() => setShowPopup(false)}
            minimumTrackTintColor={colors.colors.darktext}
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={colors.colors.darktext}
          />
        </View>

        <View
          style={[
            styles.sliderContainer,
            { width: adjustedFlashcardWidth * 0.3 },
          ]}
        >
          <View style={styles.gradientSlider}>
            <LinearGradient
              colors={["#000000", "#D3D3D3"]}
              start={[0, 0]}
              end={[1, 0]}
              style={StyleSheet.absoluteFill}
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={0}
              onValueChange={(value) => {
                const grayValue = Math.round(value * 211);
                setStrokeColor(`rgb(${grayValue}, ${grayValue}, ${grayValue})`);
              }}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor={colors.colors.darktext}
            />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            style={styles.iconButton}
            onPress={() =>
              isFlipped
                ? backCanvasRefs.current[currentCardIndex]?.undo()
                : frontCanvasRefs.current[currentCardIndex]?.undo()
            }
          />
          <Ionicons
            name="arrow-forward"
            size={24}
            color="#fff"
            style={styles.iconButton}
            onPress={() =>
              isFlipped
                ? backCanvasRefs.current[currentCardIndex]?.redo()
                : frontCanvasRefs.current[currentCardIndex]?.redo()
            }
          />
          <TouchableOpacity
            style={[
              styles.iconButton,
              isEraserMode && styles.activeEraserButton,
            ]}
            onPress={() => {
              const newEraserMode = !isEraserMode;
              if (isFlipped && backCanvasRefs.current[currentCardIndex]) {
                backCanvasRefs.current[currentCardIndex].eraseMode(newEraserMode);
              } else if (!isFlipped && frontCanvasRefs.current[currentCardIndex]) {
                frontCanvasRefs.current[currentCardIndex].eraseMode(newEraserMode);
              }
              setIsEraserMode(newEraserMode);
            }}
          >
            <Image
              source={require("../../../assets/icons/eraser.png")}
              style={styles.eraserIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

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
            ref={(el) => (frontCanvasRefs.current[currentCardIndex] = el)}
            style={StyleSheet.absoluteFill}
            strokeWidth={strokeWidth}
            strokeColor={isEraserMode ? "rgba(0,0,0,0)" : strokeColor}
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
            ref={(el) => (backCanvasRefs.current[currentCardIndex] = el)}
            style={StyleSheet.absoluteFill}
            strokeWidth={strokeWidth}
            strokeColor={isEraserMode ? "rgba(0,0,0,0)" : strokeColor}
            canvasColor={colors.colors.flashcard}
            allowOnlyPointerType="all"
          />
        </Animated.View>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={handleFlip}
        >
          <Ionicons name="swap-horizontal" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addCardButton}
          onPress={addFlashcard}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default createFlash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colors.background,
  },

  slidersAndButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    columnGap: 20,
  },

  sliderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },

  iconButton: {
    backgroundColor: colors.colors.darktext,
    padding: 5,
    borderRadius: 25,
  },

  eraserIcon: {
    width: 24,
    height: 24,
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

  popup: {
    position: "absolute",
    top: -30,
    backgroundColor: "rgba(54, 54, 54, 0.7)",
    padding: 8,
    borderRadius: 5,
  },

  popupText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  activeEraserButton: {
    backgroundColor: colors.colors.primary,
  },

  gradientSlider: {
    width: "100%",
    height: 20,
    borderRadius: 30,
    overflow: "hidden",
  },

  slider: {
    width: "100%",
    height: 20,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  flipButton: {
    backgroundColor: colors.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  addCardButton: {
    backgroundColor: colors.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  flipButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  flipText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.colors.darktext,
    textAlign: "center",
  },

  sideIndicator: {
    position: "absolute",
    top: 400,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 2,
  },
});