import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: 20,
    },
    heading: {
      fontSize: 25,
      textAlign: "center",
      fontWeight: "600",
      marginBottom: 20,
    },
    pressable: {
      backgroundColor: "#5757f8",
      margin: 15,
      borderRadius: 10,
      padding: 12,
    },
    updateText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 20,
    },
    error: {
      textAlign: "left",
      flexDirection: "row",
      gap: 6,
      marginLeft: 20,
      fontSize: 12,
      padding: 5,
      alignSelf: "flex-start",
      borderRadius: 10,
      color: Colors.danger,
    },
  });

export default styles;
