import React from "react";
import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import colors from "../../../colors.js";

const margin = 12;

const StackLayout = () => {
  const router = useRouter(); // Use router from expo-router

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <Stack
        screenOptions={{
          headerShown: true, // Show or hide the header globally
          headerTransparent: true,
          headerTintColor: colors.colors.darktext,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()} // Use router.back() for navigation
              style={{ marginLeft: margin }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.colors.darktext} />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen
        name="AddFlashcard" // Match the route path
        options={{
          headerShown: false, // Disable the header for AddFlashcard
        }}
      />
    </Stack>
    </GestureHandlerRootView>
  );
};

export default StackLayout;