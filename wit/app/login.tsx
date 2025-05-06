import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import MSALClient from "react-native-msal";
import colors from "../colors.js";
import { AuthContext } from "../config/authContext";
import { useContext } from "react";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { postExampleDATA } from "../cosmos/apiService";
import * as SplashScreen from 'expo-splash-screen';



const config = {
  auth: {
    clientId: "1c129f4f-46f0-4eb3-9ff8-f708880978a2",
    authority: "https://login.microsoftonline.com/" + "f1117260-f8a0-4080-a864-401f06c68314" + "/",
    redirectUri: "http://localhost:8081",
    postLogoutRedirectUri: "http://localhost:8081",
    navigateToLoginRequestURL: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};

const EntraLogin = ({ onLogin }) => {
  const [fontsLoaded] = useFonts({
    CustomFont: require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

 
  const authContext = useContext(AuthContext);
  const router = useRouter(); // Add router for navigation

  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const client = new MSALClient(config);
      const result = await client.acquireToken({
        scopes: ["User.Read"],
      });

      const user = result.account;
      setUserInfo(user);
      authContext.logIn(); // Call logIn after successful login

      // Prepare user data
      const userData = {
        id: user.homeAccountId, // Unique identifier
        name: user.name || "Unknown", // Fallback if name is not available
        email: user.username, // Assuming username is the email
        password: "", // Leave blank or handle securely if needed
      };

      // Save user data to Cosmos DB
      console.log("Saving user data to Cosmos DB:", userData); // Log user data
      const response = await postExampleDATA(userData);
      console.log("Response from postExampleDATA:", response); // Log response
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Render a loading state if fonts are not loaded
  if (!fontsLoaded) {
    SplashScreen.setOptions({
      duration: 1000,
      fade: true,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={[styles.title, { fontFamily: "CustomFont" }]}>Login</Text>
        
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { fontFamily: "CustomFont" }]}
            placeholder="Username/Email"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={[styles.input, { fontFamily: "CustomFont" }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={authContext.logIn} // Call handleLogin on button press
          >
            <Text style={[styles.buttonText, { fontFamily: "CustomFont" }]}>Login</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.orText, { fontFamily: "CustomFont" }]}>Or Sign in with:</Text>
        <TouchableOpacity style={styles.microsoftButton} onPress={handleLogin}>
          <Image
            source={require("../assets/icons/microsoft.png")}
            style={styles.microsoftLogo}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/signup/signup")}>
          <Text style={[styles.signUpText, { fontFamily: "CustomFont" }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EntraLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "RobotoMono-Regular",
  },
  loginBox: {
    backgroundColor: colors.colors.primary,
    padding: 30,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    height: "60%",
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
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 25,
    fontFamily: "RobotoMono-Regular",
    color: "#FFFFFF",
    width: "100%",
    textAlign: "left",
  },
  loginButton: {
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
  orText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginVertical: 20,
    fontFamily: "RobotoMono-Regular",
  },
  microsoftButton: {
    padding: 8,
    borderRadius: 15,
    alignItems: "center",
    width: "50%",
  },
  microsoftLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  signUpText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 50,
    fontFamily: "RobotoMono-Regular",
    textDecorationLine: "underline",
  },
});