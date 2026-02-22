import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      marginTop: 5,
      height: "100%",
    },
    editorContainer: {
      paddingBottom: 8,
      flex: 1,
      backgroundColor: "transparent",
      padding: 0,
      color: Colors.textPrimary,
    },
    line: {
      height: 1,
      backgroundColor: Colors.border,
      marginTop: 10,
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      margin: 10,
      borderColor: Colors.inputBorder,
      borderBottomWidth: 1,
      color: Colors.textPrimary,
    },
    all: {
      flex: 1,
      backgroundColor: Colors.background,
      height: "100%",
    },
    button: {
      borderWidth: 1,
      borderColor: "#8e8e8eff",
      borderRadius: 10,
      width: 40,
      backgroundColor: "#d2cfcfff",
    },
    input: {
      margin: 10,
      height: "100%",
      color: "#000",
    },
    bold: {
      fontWeight: "800",
    },
    italic: {
      fontStyle: "italic",
    },
    buttonText: {
      fontSize: 20,
      textAlign: "center",
    },
    content: {
      backgroundColor: "#000",
      height: "100%",
    },

    headerButton: {
      backgroundColor: Colors.iconSoftBg,
      borderRadius: 50,
      padding: 5,
    },
    header: {
      flexDirection: "row",
      alignSelf: "baseline",
      gap: 20,
    },
    modal: {
      shadowRadius: 10,
      padding: 5,
      elevation: 5,
      flexDirection: "row",
      backgroundColor: Colors.surfaceSoft,
      justifyContent: "space-around",
    },
    options: {
      flexDirection: "row",
      justifyContent: "space-around",
      // paddingBottom: 25,
      //elevation: 5,
    },
    optionButton: {
      padding: 5,
      backgroundColor: Colors.iconSoftBg,
      borderRadius: 25,
    },
    optionIcon: {
      color: Colors.iconPrimary,
      padding: 5,
    },
    headerMenu: {
      alignSelf: "flex-end",
      width: "auto",
      backgroundColor: "#fafafa",
      padding: 12,
      paddingBottom: 0,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 10,
    },
    touchables: {
      flexDirection: "row",
      gap: 5,
      padding: 5,
    },
    touchableText: {
      textAlign: "center",
      alignSelf: "center",
    },
    toolbar: {
      backgroundColor: Colors.surfaceSoft,
    },
    attachmentOptions: {
      justifyContent: "center",
      gap: 10,
      marginBottom: 10,
      marginLeft: 15,
    },
    attachment: {
      flexDirection: "row",
      backgroundColor: "#E0E7FF",
      padding: 10,
      borderRadius: 10,
      width: 45,
      alignContent: "center",
    },
    close: {
      position: "absolute",
      right: 4,
      top: 5,
      backgroundColor: Colors.iconPrimary,
      padding: 3,
      borderRadius: 10,
    },
    imageSize: {
      fontSize: 10,
      color: Colors.textSecondary,
    },
    fileContainer: {
      width: 80,
      alignItems: "center",
      marginRight: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 10,
      backgroundColor: Colors.primaryPressed,
    },
    existingFile: {
      padding: 8,
      marginRight: 10,
      borderRadius: 8,
      backgroundColor: Colors.primaryPressed,
      height: 50,
    },
  });

export default styles;
