import { Drawer } from 'expo-router/drawer';  
import EntraLogin from "./login/entra"; // Import the login screen
import { useState } from "react";

export default function Layout() {  
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  if (!isLoggedIn) {
    // Show the login screen if the user is not logged in
    return <EntraLogin />;
  }

  return (  
    <Drawer>
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      <Drawer.Screen name="AddFlashcard" options={{ headerShown: false }} />
      <Drawer.Screen name="StudyFlashcard" options={{ headerShown: false }} />
      <Drawer.Screen name="signup" options={{ headerShown: false }} />
    </Drawer>
  );  
}