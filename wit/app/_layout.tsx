import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../config/authContext";

export default function ProtectedLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(protected))"
          options={{
            animation: "none",
          }}
        />
        <Stack.Screen
          name="entra"
          options={{
            animation: "none",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
