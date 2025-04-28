import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import MSALClient from "react-native-msal";
import colors from "../../colors.js";
import * as Font from "expo-font";
import { useRouter } from "expo-router";

const config = {
  auth:{
  clientId: "1c129f4f-46f0-4eb3-9ff8-f708880978a2", 
  authority: "https://login.microsoftonline.com/" + "f1117260-f8a0-4080-a864-401f06c68314" + "/",
  redirectUri: "http://localhost:8081",
  postLogoutRedirectUri: "http://localhost:8081",
  navigateToLoginRequestURL: false,
  },
  cache: {
    cacheLocation: "sessionStorage", // or "sessionStorage"
    storeAuthStateInCookie: true, // set to true for IE 11
  },

};

const EntraLogin = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "RobotoMono-Regular": require("../../assets/fonts/RobotoMono-Regular.ttf"),
      });
    };
    loadFonts();
  }, []);

  const handleLogin = async () => {
    try {
      const client = new MSALClient(config);
      const result = await client.acquireToken({
        scopes: ["User.Read"], 
      });
      setUserInfo(result.account);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleUsernamePasswordLogin = () => {
    if (username && password) {
      console.log("Username:", username, "Password:", password);
    } else {
      console.error("Please enter both username and password");
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <Text style={styles.text}>Welcome, {userInfo.username}</Text>
      ) : (
        <View style={styles.loginBox}>
          <Text style={styles.title}>Login</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleUsernamePasswordLogin}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.orText}>Or Sign in with:</Text>
          <TouchableOpacity style={styles.microsoftButton} onPress={handleLogin}>
            <Image
              source={require("../../assets/icons/microsoft.png")}
              style={styles.microsoftLogo}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("./signup")}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 15,
    fontFamily: "RobotoMono-Regular",
    color: "#FFFFFF",
    width: "100%",
    textAlign: "left",
  },
  forgotPassword: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "right",
    marginBottom: 15,
    fontFamily: "RobotoMono-Regular",
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