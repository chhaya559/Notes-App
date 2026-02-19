import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      backgroundColor: Colors.background,
      flexDirection: "row",
      paddingTop: 50,
      justifyContent: "space-between",
      padding: 15,
      paddingBottom: 0,
    },
    left: {
      flexDirection: "row",
      gap: 8,
    },
    right: {},
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginLeft: -35,
      paddingTop: 5,
      color: Colors.textPrimary,
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
