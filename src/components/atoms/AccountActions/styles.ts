import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      margin: 30,
      backgroundColor: Colors.surface,
      borderRadius: 20,
      padding: 20,
    },
    wrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
      alignItems: "center",
    },
    wrap: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    iconWrap: {
      backgroundColor: Colors.iconSoftBg,
      borderRadius: 25,
      padding: 4,
    },
    text: {
      textAlign: "center",
      justifyContent: "center",
      fontSize: 15,
      color: Colors.textPrimary,
    },
    line: {
      height: 1,
      backgroundColor: Colors.borderLight,
    },
    actionIcon: {
      backgroundColor: Colors.iconSoftBg,
      borderRadius: 25,
      padding: 8,
    },
  });

export default styles;
