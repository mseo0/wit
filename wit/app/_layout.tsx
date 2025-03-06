import { Drawer } from 'expo-router/drawer';  

export default function Layout() {  
  return (  
    <Drawer>  
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />  
      <Drawer.Screen name="AddFlashcard" options={{ headerShown: false }} />  
      <Drawer.Screen name="StudyFlashcard" options={{ headerShown: false }} />  
    </Drawer>  
  );  
}  