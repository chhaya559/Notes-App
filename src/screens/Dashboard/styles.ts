import { ThemeColors } from "@theme/constants";
import { Dimensions, StyleSheet } from "react-native";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;
const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // position: "relative",
      padding: 12,
      backgroundColor: Colors.background,
    },
    static: {
      borderRadius: 16,
      padding: 20,
      paddingTop: 5,
      paddingLeft: 10,
    },
    staticText: {
      color: Colors.textSecondary,
      fontSize: 32,
      fontWeight: "700",
      includeFontPadding: true,
    },
    staticSecondaryText: {
      color: Colors.textSecondary,
      fontSize: 16,
      paddingTop: 10,
    },
    search: {
      flex: 1,
      fontSize: 15,
      marginLeft: 10,
      color: Colors.textPrimary,
    },
    SearchBar: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      marginLeft: 10,
      marginRight: 10,
      paddingHorizontal: 14,
      borderRadius: 25,
      backgroundColor: Colors.surface,
      paddingVertical: 3,
      borderColor : Colors.borderLight,
    },

    focus: {
      borderColor: Colors.primary,
      borderWidth: 1,
    },

    add: {
      position: "absolute",

      bottom: 20,
      //left: 20,
      right: 15,
      
    },
    image: {
      height: 26,
      width: 26,
      borderRadius: 15,
      marginRight: 10,
    },

    emptyText: {
      fontWeight: "500",
      fontSize: 22,
      textAlign: "center",
      color: Colors.textPrimary,
    },
    emptySecondaryText: {
      textAlign: "center",
      margin: 10,
      color: Colors.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      alignSelf: "center",
      backgroundColor: Colors.surfaceAccent,
      height: screenHeight * 0.4,
      width: screenWidth * 0.8,
      verticalAlign: "middle",
      justifyContent: "center",
      alignContent: "center",
      marginTop: screenHeight * 0.1,
      marginBottom: screenHeight * 0.1,
      borderRadius: 20,
    },
    option: {
      backgroundColor: Colors.primary,
      padding: 7,
      borderRadius: 20,
      marginLeft: 10,
      marginBottom: 10,
    },
    optionText: {
      color: Colors.textPrimary,
      fontSize: 16,
    },
    optionContainer: {
      flexDirection: "row",
      gap: 15,
    },
  });

export default styles;
