import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      backgroundColor: Colors.background,
      flexDirection: "row",
      paddingTop: 50,
      padding: 15,
      paddingBottom: 0,
      justifyContent: "space-between",
    },
    left: {
      flexDirection: "row",
      gap: 8,
    },
    right: {},
    title: {
      fontSize: 22,
      fontWeight: "bold",

      paddingTop: 5,
      color: Colors.textPrimary,
      textAlign: "center",
      marginLeft: -30,
    },
    headerButton: {
      backgroundColor: Colors.iconSoftBg,
      borderRadius: 50,
      marginTop: 0,
      justifyContent: "center",
      verticalAlign: "middle",
    },
  });

export default styles;
