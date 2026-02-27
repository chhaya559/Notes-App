import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.surfaceSoft,
      borderRadius: 10,
      padding: 15,
      borderWidth: 1,
      borderColor: Colors.primary,
    },
    headingContainer: {
      flexDirection: "row",
      gap: 10,
      paddingBottom: 10,
      paddingTop: 8,
    },
    line: {
      height: 1,
      borderColor: Colors.border,
      width: "100%",
      borderWidth: 1,
      borderStyle: "dashed",
    },
    headingText: {
      textAlign: "center",
      color: Colors.primary,
      fontWeight: "bold",
      fontSize: 21,
      verticalAlign: "middle",
      textAlignVertical: "center",
      marginTop: 2,
    },
    contentView: {
      padding: 10,
      marginLeft: 0,
      marginRight: 0,
    },
    close: {
      position: "absolute",
      right: 2,
      top: 13,
    },
    pressable: {
      margin: 10,
      backgroundColor: Colors.primary,
      borderRadius: 10,
      marginTop: 20,
      padding: 4,
    },
    setText: {
      color: Colors.textOnPrimary,
      fontSize: 18,
      fontWeight: "400",
      padding: 10,
      textAlign: "center",
    },
    calendar: {
      position: "absolute",
      top: 191,
      right: 25,
    },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: Colors.primaryBorder,
      padding: 10,
      marginTop: 3,
      marginBottom: 2,
      color: Colors.textPrimary,
    },
    focused: {
      borderWidth: 3,
      borderColor: Colors.primaryPressed,
    },

    textInput: {
      margin: 3,
      fontSize: 15,
      color: Colors.textPrimary,
    },
    iconBackground: {
      backgroundColor: Colors.iconSoftBg,
      padding: 3,
      borderRadius: 25,
    },
  });

export default styles;
