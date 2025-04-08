import React, { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import colors from "../../colors.js";
import { useFonts } from "expo-font";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Ionicons } from "@expo/vector-icons";

const createFlash = () => {
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [showPopup, setShowPopup] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false); // Add state for eraser mode
  const canvasRef = useRef(null);

  const [fontsLoaded] = useFonts({
    CustomFont: require("../../assets/fonts/Comfortaa-Medium.ttf"),
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
      <View style={styles.slidersAndButtonsRow}>
        {/* Stroke Width Slider */}
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

              // Ensure the stroke width is updated dynamically
              if (canvasRef.current) {
                canvasRef.current.eraseMode(isEraserMode); // Maintain current mode
              }
            }}
            onSlidingComplete={() => setShowPopup(false)}
            minimumTrackTintColor={colors.colors.darktext}
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={colors.colors.darktext}
          />
        </View>

        {/* Stroke Color Slider */}
        <View
          style={[
            styles.sliderContainer,
            { width: adjustedFlashcardWidth * 0.3 },
          ]}
        >
          <View style={styles.gradientSlider}>
            <LinearGradient
              colors={["#000000", "#D3D3D3"]} // Adjusted gradient to start with black
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
                // Adjusted formula to cap the color at #D3D3D3 (211, 211, 211)
                const grayValue = Math.round(value * 211); // Map value (0 to 1) to gray scale (0 to 211)
                setStrokeColor(`rgb(${grayValue}, ${grayValue}, ${grayValue})`);
              }}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor={colors.colors.darktext}
            />
          </View>
        </View>

        {/* Buttons for Undo, Redo, and Eraser */}
        <View style={styles.buttonsContainer}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            style={styles.iconButton}
            onPress={() => canvasRef.current?.undo()}
          />
          <Ionicons
            name="arrow-forward"
            size={24}
            color="#fff"
            style={styles.iconButton}
            onPress={() => canvasRef.current?.redo()}
          />
          <TouchableOpacity
            style={[
              styles.iconButton,
              isEraserMode && styles.activeEraserButton, // Highlight eraser when active
            ]}
            onPress={() => {
              if (canvasRef.current) {
                const newEraserMode = !isEraserMode;
                canvasRef.current.eraseMode(newEraserMode);
                setIsEraserMode(newEraserMode);
              }
            }}
          >
            <Image
              source={require("../../assets/icons/eraser.png")}
              style={styles.eraserIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Flashcard Canvas */}
      <View
        style={[
          styles.flashcard,
          { width: adjustedFlashcardWidth, height: adjustedFlashcardHeight },
        ]}
      >
        <ReactSketchCanvas
          ref={canvasRef}
          style={StyleSheet.absoluteFill}
          strokeWidth={strokeWidth} // Stroke width applies to both drawing and eraser
          strokeColor={isEraserMode ? "rgba(0,0,0,0)" : strokeColor} // Transparent color for eraser
          canvasColor={colors.colors.flashcard}
          allowOnlyPointerType="all"
        />
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
    backgroundColor: colors.colors.primary, // Change color to indicate active state
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
});