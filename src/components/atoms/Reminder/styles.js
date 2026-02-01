import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 15,
    padding: 10,
    
  },
  headingContainer: {
    flexDirection: "row",
    gap: 5,
  },
  headingText: {
    textAlign: "center",
    color: "#5757f8",
    fontWeight: "500",
    fontSize: 16,
  },
  close: {
    position: "absolute",
    right: 20,
    top: 7,
  },
  pressable: {
    margin: 15,
    backgroundColor: "#5757f8",
    borderRadius : 10,
  },
  setText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
    padding: 10,
    textAlign : "center"
  },
  calendar: {
    position: "absolute",
    top: 75,
    right: 30,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#e4e4e4",
  },
  focused: {
    borderWidth: 2,
    borderColor: "#000",
  },
  date: {
    fontWeight: "500",
    marginTop : 5,
    marginBottom : 10,
    marginLeft : 5
  },
});

export default styles;
