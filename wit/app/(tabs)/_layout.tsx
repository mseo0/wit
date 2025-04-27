import "react-native-gesture-handler";
import { useState } from "react";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../colors.js";
import EntraLogin from "./entra"; // Import your login screen

const DrawerLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  if (!isLoggedIn) {
    // Show the login screen if the user is not logged in
    return <EntraLogin />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: colors.colors.darktext,
          drawerStyle: {
            backgroundColor: colors.colors.drawerActive,
          },
          drawerActiveTintColor: colors.colors.darktext,
          drawerInactiveTintColor: colors.colors.darktext,
        }}
      >
        {/* Home Screen */}
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            headerTitle: "",
            drawerIcon: ({ size, color }) => (
              <Ionicons
                name="home-outline"
                size={size}
                color={colors.colors.darktext}
              />
            ),
          }}
        />

        {/* Recycle Bin */}
        <Drawer.Screen
          name="recycleBin"
          options={{
            drawerLabel: "Recycle Bin",
            headerTitle: "Recycle Bin",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="trash-bin-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Settings */}
        <Drawer.Screen
          name="settingsMain"
          options={{
            drawerLabel: "Settings",
            headerTitle: "Settings",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;