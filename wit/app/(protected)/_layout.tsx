import { AuthContext } from "../../config/authContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";


export const unstable_settings = {
  initialRouteName: "(tabs)", // anchor
};

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  if (!authState.isReady) {
    return null;
  }

  if (!authState.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddFlashcard"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StudyFlashcard"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}