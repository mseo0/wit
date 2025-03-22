import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../colors.js";
import { useRouter } from "expo-router";

const settings = () => {
  const router = useRouter();

  return (
    <View
      style={styles.container}>
      <Text></Text>
    </View>
  );
}

export default settings;



const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colors.background, // Use theme background
  },

  text: {
    fontSize: 18,
    color: colors.colors.text,
  },

})