import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../colors.js";
import { useRouter } from "expo-router";

const home = () => {
  const router = useRouter();

  return (
    <View
      style={styles.container}>
      <Text></Text>

      {/*button*/}
      <TouchableOpacity
        style = {styles.fcAdd}
        onPress = {() => router.push("./AddFlashcard/flashcardDraw")}>

          <Ionicons name = "add" size={30} color="white"/>
        </TouchableOpacity>


    </View>
  );
}

export default home;



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

  fcAdd:{
    position: "absolute",
    bottom:30,
    right:30,
    backgroundColor: colors.colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",

  }
})