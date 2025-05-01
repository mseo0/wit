import React from "react";
import { Stack } from "expo-router";

const SignupLayout = () => {
  return (
    <Stack>
      {/* Define the stack navigator for the signup flow */}
      <Stack.Screen name="index" options={{ title: "Sign Up" }} />
    </Stack>
  );
};

export default SignupLayout;
