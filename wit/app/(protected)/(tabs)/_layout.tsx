import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../colors.js";

const DrawerLayout = () => {
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