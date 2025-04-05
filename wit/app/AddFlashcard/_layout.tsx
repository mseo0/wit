import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; 
import { DrawerActions } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import colors from "../../colors.js";

const margin = 12;


const DrawerLayout = () => {
  const router = useRouter(); 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerTransparent: true,
          headerTintColor: colors.colors.darktext,
          headerTitle: "",
          drawerStyle: {
            backgroundColor: colors.colors.drawerActive,
          },
          drawerActiveTintColor: colors.colors.darktext,
          drawerInactiveTintColor: colors.colors.darktext,
          drawerPosition: "right", 

          // Back button on the left
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()} 
              style={{ marginLeft: margin }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.colors.darktext} />
            </TouchableOpacity>
          ),

        
        })}
      >
        {/* Home Screen */}
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "",
            headerTitle: "",
            drawerPosition: "right", 
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={colors.colors.darktext} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
