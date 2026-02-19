import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    headerLeft: {
      flexDirection: "row",
      gap: 10,
    },

    text: {
      fontSize: 18,
      color: Colors.textPrimary,
      fontWeight: "600",
      alignSelf: "center",
      paddingLeft: 10,
    },
  });
export default styles;
