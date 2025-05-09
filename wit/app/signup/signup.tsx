import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import colors from "../../colors.js";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useContext } from "react";
import { AuthContext } from "../../config/authContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "RobotoMono-Regular": require("../../assets/fonts/RobotoMono-Regular.ttf"),
      });
    };
    loadFonts();
  }, []);

  const handleSignup = () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    authContext.logOut(); 
    console.log("Username:", username, "Password:", password);
  };


  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Create Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Create Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginRedirectText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colors.background,
  },
  loginBox: {
    backgroundColor: colors.colors.primary,
    padding: 30,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    height: "65%",
    width: "45%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    fontFamily: "RobotoMono-Regular",
  },
  form: {
    width: "100%",
    marginBottom: 20,
    justifyContent: "space-between", // Added to space out the boxes evenly
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 25, // Adjusted spacing between boxes
    backgroundColor: "transparent",
    fontFamily: "RobotoMono-Regular",
    color: "#FFFFFF",
    width: "100%",
    textAlign: "left",
  },
  signupButton: {
    backgroundColor: "#89CFF0",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "RobotoMono-Regular",
  },
  loginRedirectText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "RobotoMono-Regular",
    textDecorationLine: "underline",
  },
});
