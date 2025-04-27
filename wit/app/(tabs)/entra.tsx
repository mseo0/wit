import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from '@react-native-vector-icons/ionicons';
import MSALClient from "react-native-msal";
import colors from "../../colors.js";


const config = {
  clientId: "cd0bbe46-cc26-4b8c-a44a-bc2beb1edad4", 
  authority: "https://login.microsoftonline.com/"+ "f1117260-f8a0-4080-a864-401f06c68314"//tenant
  redirectUri: "myapp://auth",
};

const EntraLogin = () => {
  const [userInfo, setUserInfo] = useState(null);

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

  return (
    <View style={styles.container}>
      {userInfo ? (
        <Text style={styles.text}>Welcome, {userInfo.username}</Text>
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Icon name="windows" size={60} color="white" />
        </TouchableOpacity>
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
  text: {
    fontSize: 18,
    color: "#333",
  },
  loginButton: {
    backgroundColor: colors.colors.secondary, 
    padding: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});