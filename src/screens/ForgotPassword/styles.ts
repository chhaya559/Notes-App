import { ThemeColors } from "@theme/constants";
import { StyleSheet } from "react-native";

const styles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      //alignContent: "flex-start",
      backgroundColor: Colors.background,
    },
    heading: {
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 15,
      margin: 10,
    },
    text: {
      fontSize: 18,
      fontWeight: "400",
      margin: 10,
      textAlign: "center",
    },
    pressable: {
      backgroundColor: "#151cf8ff",
      padding: 15,
      margin: 15,
      borderRadius: 15,
      alignContent: "center",
    },
    pressableText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 18,
      textAlign: "center",
    },
    navigator: {
      flexDirection: "row",
      gap: 5,
      justifyContent: "center",
      marginTop: 10,
    },
    backText: {
      fontSize: 16,
    },
    error: {
      textAlign: "left",
      flexDirection: "row",
      gap: 6,
      marginLeft: 20,
      fontSize: 12,
      padding: 5,
      width: "a",
      alignSelf: "flex-start",
      borderRadius: 10,
      color: "#ff0000ff",
    },
    modal: {
      height: 300,

      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f2f2f2",
      position: "relative",
      borderRadius: 10,
      padding: 10,
    },
    modalHeading: {
      color: "#000000ff",
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 10,
    },
    modalText: {
      textAlign: "center",
      margin: 10,
      marginTop: 30,
      marginBottom: 40,
    },

    modalLogin: {
      color: "#fff",
      fontWeight: "400",
      fontSize: 18,
      textAlign: "center",
    },
    iconWrap: {
      backgroundColor: "#E0E7FF",
      padding: 15,
      borderRadius: 50,
    },
    backButtom: {
      backgroundColor: "#5757f8",
      padding: 10,
      marginLeft: 15,
      marginRight: 15,
      width: 200,
      borderRadius: 15,
    },
    cross: {
      position: "absolute",
      right: 15,
      top: 268,
      backgroundColor: "#e0e7ff",
      borderRadius: 25,
    },
  });

export default styles;
